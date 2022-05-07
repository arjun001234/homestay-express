
import {Handler, Request} from 'express'
import { Exceptions, UserRepo } from '../models/model'
import multer,{Multer} from 'multer'
import path from 'path'
import { Token } from './token'

interface MiddlewareType {
    uRepo: UserRepo
    Auth: () => Handler
    upload: Multer
}

export class Middleware implements MiddlewareType {
    uRepo: UserRepo
    upload: Multer
    tokenService: Token
    constructor(uRepo: UserRepo,tokenService: Token){
     this.uRepo = uRepo
     this.tokenService = tokenService
     this.upload = multer({storage: this.getStorage(),fileFilter: this.getFileFilter()})
    }
    private getStorage() : multer.StorageEngine {
        return multer.diskStorage({
            destination: (req,field,cb) => {
               const uploadPath = path.join("public/images")
               cb(null,uploadPath)
            },
            filename: (req, file, cb) => {
                const fileName = file.originalname.toLowerCase().split(' ').join('-');
                cb(null, fileName)
            }
        })
    }

    private getFileFilter() {
        return (req: Request,file: Express.Multer.File,cb: multer.FileFilterCallback) => {
            if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
                return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
            }
        }
    }


    Auth() : Handler {
        return (req,res,next) => {
            const authHeader = req.headers.authorization
            if (authHeader) {
                const token = authHeader.split(' ')[1];
                const id = this.tokenService.ExtractId(token)
                console.log(id)
                const result = this.uRepo.Find(id)
                if (result === Exceptions.NOT_FOUND){
                    return res.status(404).send({message: "user not found"})
                }
                req.user = result
                next()
            } else {
                return res.sendStatus(400).send({message: "auth token not provided"});
            }
        }
    }
    Upload() : Multer {
        return multer()
    }
}