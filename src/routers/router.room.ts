import { Handler } from "express";
import { Middleware } from "../helpers/midddleware";
import { Room } from "../models/model.room";
import { RoomServiceType } from "../services/service.room";
import { Singelton } from "../utils/decorator";
import { RouterClass } from "./router";

interface RoomRouterType {
    Create: (path: string) => void
    Get: (path: string) => void
    GetAll: (path: string) => void
}

@Singelton()
export class RoomRouter extends RouterClass implements RoomRouterType {
   protected roomService: RoomServiceType
   constructor(service: RoomServiceType,md: Middleware){
       super("/room",md)
       this.roomService = service
       this.init()
   }
   init(): void {
       this.Create("")
   }

   Create(path: string) : void {
       this.router.post(path,this.md.Auth,(req,res) => {
           try {
              return this.roomService.Create(req,res);  
           } catch (error) {
            return res.status(error.status).send(error.message)
           }
       })
   }

   Delete(path: string) : void {
    this.router.delete(path,this.md.Auth,(req,res) => {
        try {
           return this.roomService.Delete(req,res);  
        } catch (error) {
         return res.status(error.status).send(error.message)
        }
    })
    }

   Update(path: string) : void {
    this.router.patch(path,this.md.Auth,(req,res) => {
        try {
           return this.roomService.Update(req,res);  
        } catch (error) {
         return res.status(error.status).send(error.message)
        }
    })
    }

   Get(path: string) : void {
    this.router.get(path,(req,res) => {
        try {
           return this.roomService.Get(req,res);  
        } catch (error) {
         return res.status(error.status).send(error.message)
        }
    })
    }

    GetAll(path: string) : void {
        this.router.get(path,(req,res) => {
            try {
               return this.roomService.GetAll(req,res);  
            } catch (error) {
             return res.status(error.status).send(error.message)
            }
        })
    }

} 