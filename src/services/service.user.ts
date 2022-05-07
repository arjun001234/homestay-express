import {Request,Response} from 'express'
import { v4 } from 'uuid';
import { Token } from '../helpers/token';
import { Exceptions, UserRepo, UserRole } from "../models/model";
import { NewUserDto, UpdateUserDto, User, UserLoginDto } from '../models/model.user';
import { Req, Res, Singelton, ValidateBody, VerifyId } from '../utils/decorator';
import { ServiceClass, ServiceType } from "./service";

export interface UserServiceType extends ServiceType {
    login : (req: Request,res: Response) => void
    logout: (req: Request,res: Response) => void
    me: (req: Request,res: Response) => void
}

@Singelton()
export class UserService extends ServiceClass<UserRepo,User> implements UserServiceType {
    tokenService: Token
    constructor(repo: UserRepo,tokenService: Token){
     super(repo)
     this.tokenService = tokenService
    }

    protected SetSession(req: Request,user: User) {
         let session = req.session
         session.user = user
    }

    @ValidateBody(NewUserDto,{})
    Create(@Req() req: Request<{},{},NewUserDto>,@Res() res: Response) : void {
        const input = req.body
        const user = {
            ...input,
            id: v4(),
            role: UserRole.USER
        } as User 
        this.repo.Create(user)
        req.cookies
        res.status(201).send({
            user: user,
            token: this.tokenService.GenerateToken(user.id)
        })
    } 

    @ValidateBody(UserLoginDto,{})
    login(@Req() req: Request<{},{},UserLoginDto>,@Res() res: Response) {
        const input = req.body
        const result = this.repo.FindUserByEmail(input.email)
        if (result === Exceptions.NOT_FOUND){
            res.status(400).send({message: "user not found with this email"})
            return
        }
        if (req.body.password !== result.password){
            res.status(400).send({message: "incorrect password"})
            return
        }
        console.log(result)
        res.status(200).send({
            user: result,
            token: this.tokenService.GenerateToken(result.id)
        })
    }

    
    logout(@Req() req: Request<{},{},UserLoginDto>,@Res() res: Response) {
        let session = req.session
        session.destroy((err) => {
           return res.status(400).send(err)
        })
        const user = session.user
        res.status(200).send(user)
    }

    me(@Req() req: Request, @Res() res: Response) {
        console.log(req.user)
        res.status(200).send(req.user)
    }

    @VerifyId(false)
    Get(@Req() req: Request,@Res() res: Response) : void {
        const id = req.params.id
        const result = this.repo.Find(id)
        console.log(result)
        if (result === Exceptions.NOT_FOUND){
           res.status(404).send({message: "user not found"})
           return
        }
        res.status(200).send(result)
    }

    @ValidateBody(UpdateUserDto,{
        skipMissingProperties: true,
        whitelist: true
    })
    @VerifyId(true)
    Update(@Req() req: Request<{},{},UpdateUserDto>,@Res() res: Response) : void {
        const input = req.body
        let user = req.session.user
        user = {
            ...user,
            ...input
        }
        const result = this.repo.Update(user)
        if (result === Exceptions.NOT_FOUND){
           res.status(404).send({message: "user not found"})
           return
        }
        res.status(200).send(user)
    }

    @VerifyId(true)
    Delete(@Req() req: Request,@Res() res: Response) : void {
        let session = req.session
        const user = session.user
        session.destroy((err) => {
            return res.status(400).send(err)
        })
        res.status(201).send(user)
    }

    GetAll(_: Request,res: Response) : void {
        res.status(200).send(this.repo.FindAll())
    }
}