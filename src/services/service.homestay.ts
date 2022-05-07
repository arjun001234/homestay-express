import { Request, Response } from "express";
import { v4 } from "uuid";
import { Exceptions, HomestayRepo, UserRole } from "../models/model";
import { Homestay, NewHomestayDto, UpdateHomeStayDto } from "../models/model.homestay";
import { Room } from "../models/model.room";
import { User } from "../models/model.user";
import { RoomRepo } from "../repos/repo.room";
import { Req, Res, Role, Singelton, ValidateBody, VerifyId } from "../utils/decorator";
import { ServiceClass, ServiceType } from "./service";

export interface HomestayServiceType extends ServiceType {
    SearchHomestay: (req: Request,res: Response) => void
}

@Singelton()
export class HomestayService extends ServiceClass<HomestayRepo,Homestay> implements HomestayService {
    roomRepo: RoomRepo
    constructor(repo: HomestayRepo,roomRepo){
        super(repo)
        this.roomRepo = roomRepo
    }

    private VerifyQueryParams(req: Request) : boolean | string {
        const keys = Object.keys(req.query)
        if (keys.length === 0){
            return true
        }
        const allowedValues = ["city","country","state","name"]
        const key = allowedValues.find(val => val === keys[0].toLowerCase())
        if (!key) {
            return false
        }
        return keys[0]
    }

    @ValidateBody(NewHomestayDto,{})
    @Role(UserRole.ADMIN)
    Create(@Req()req: Request<{},{},NewHomestayDto>,@Res() res: Response) : void {
        const input = req.body
        const homestay : Homestay = {
            id: v4(),
            img: [],
            rooms: [],
            ...input,
        }
        const files = req.files as Express.Multer.File[]
        files.map((file) => {
          homestay.img.push("http://localhost:4000/images/"+file.filename)
        })

        homestay.rooms.map((room,index) => {
                const newRoom : Room = {
                    id: v4(),
                    homestayId: homestay.id,
                    ...room
                }
                const result = this.roomRepo.Create(newRoom)
                homestay.rooms[index] = result
        })

        this.repo.Create(homestay)
        
        res.status(201).send(homestay)
    }

    @VerifyId(false)
    Get(req: Request,res: Response) : void {
        const homestay = this.Find(req.params.id,res,"homestay not found")
        res.render("singleHomestay",{homestay: homestay})
    }

    @ValidateBody(UpdateHomeStayDto,{skipMissingProperties: true,whitelist: true})
    @Role(UserRole.ADMIN)
    Update(@Req() req: Request<any,{},UpdateHomeStayDto>,@Res() res: Response) : void {
        const input = req.body
        let homestay = this.Find(req.params.id,res,"homestay not found")
        homestay = {
            ...homestay,
            ...input
        }
        this.repo.Update(homestay)
        res.status(200).send(homestay)
    }

    @Role(UserRole.ADMIN)
    Delete(@Req() req: Request,@Res() res: Response) : void {
        const homestay = this.Find(req.params.id,res,"homestay not found")
        homestay.rooms.map((room) => {
            this.roomRepo.Delete(room.id)
        })
        this.repo.Delete(homestay.id)
        res.status(200).send(homestay)
    }

    GetAll(req: Request,res: Response) : void {
        const result = this.VerifyQueryParams(req)
        console.log(result)
        if (result === false) {
            res.status(400).send({message: "invalid search"})
            return
        }
        if (result === true) {
            res.status(200).send(this.repo.FindAll())
            return
        }
        res.status(200).send(this.repo.Search(result.toLowerCase(),req.query[result] as string))
    }
}