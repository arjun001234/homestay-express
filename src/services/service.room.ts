import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { v4 } from "uuid";
import { Exceptions, UserRole } from "../models/model";
import { Homestay } from "../models/model.homestay";
import { NewRoomDto, Room } from "../models/model.room";
import { HomestayRepoClass } from "../repos/homestay.repo";
import { RoomRepoType } from "../repos/repo.room";
import { Role, Singelton, ValidateBody, VerifyId } from "../utils/decorator";
import { ServiceClass, ServiceType } from "./service";

export interface RoomServiceType extends ServiceType {}

@Singelton()
export class RoomService extends ServiceClass<RoomRepoType,Room> implements RoomServiceType {
    homestayRepo: HomestayRepoClass
    constructor(repo: RoomRepoType,homestayRepo: HomestayRepoClass){
        super(repo)
        this.homestayRepo = homestayRepo
    }

    @ValidateBody(NewRoomDto,{})
    @Role(UserRole.ADMIN)
    Create(req: Request<ParamsDictionary, any, NewRoomDto, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): void {
        const input = req.body

        const result = this.homestayRepo.Find(input.homestayId)
        if (result === Exceptions.NOT_FOUND) {
            res.status(404).send({message: "homestay not found"})
            return
        }

        delete input.homestayId

        const newRoom : Room = {
            id: v4(),
            homestayId: result.id,
            ...input
        }

        this.homestayRepo.Save(result)

        this.repo.Create(newRoom)

        res.status(201).send(newRoom)
    }


    @VerifyId(false)
    Get(req: Request<{id: string}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): void {
        const room = this.Find(req.params.id,res,"homestay not found")
        res.status(200).send(room)
    }


    GetAll(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): void {
        res.status(200).send(this.repo.FindAll())
    }

    @ValidateBody(NewRoomDto,{skipMissingProperties:true,whitelist: true})
    @VerifyId(true)
    @Role(UserRole.ADMIN)
    Update(req: Request<{id: string}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): void {
        const input = req.body
        let room = this.Find(req.params.id,res,"Room not found")
        room = {
            ...room,
            ...input
        }
        this.repo.Update(room)
        res.status(200).send(room)
    }

    @VerifyId(true)
    @Role(UserRole.ADMIN)
    Delete(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): void {
        const room = this.Find(req.params.id,res,"Room not found")
        this.repo.Delete(room.id)
        res.status(200).send(room)
    }
}