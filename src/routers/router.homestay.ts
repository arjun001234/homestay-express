
import { Middleware } from "../helpers/midddleware";
import { HomestayService, HomestayServiceType } from "../services/service.homestay";
import { Singelton } from "../utils/decorator";
import { RouterClass } from "./router";

interface HomestayRouterType {}

@Singelton()
export class HomestayRouter extends RouterClass implements HomestayRouterType {
   protected homestayService : HomestayService
   constructor(service: HomestayService,md: Middleware){
       super("/homestay",md)
       this.homestayService = service
       this.init()
   } 
   init(): void {
    this.Get("/:id")
    this.Create("")
    this.GetAll("")
    this.Delete("/:id")
    this.Update("/:id")
   }

   
   Create(path: string) {
       return this.router.post(path,this.md.upload.array("images"),(req,res) => {
           try {
               return this.homestayService.Create(req,res)
           } catch (error) {
               return res.status(error.status || 400).send(error.message)
           }
       })
   } 
 
   Get(path: string) {
    return this.router.get(path,(req,res) => {
        try {
            return this.homestayService.Get(req,res)
        } catch (error) {
            return res.status(error.status || 400).send(error.message)
        }
    }) 
   }

   Update(path: string) {
    return this.router.patch(path,this.md.Auth,(req,res) => {
        try {
            return this.homestayService.Update(req,res)
        } catch (error) {
            return res.status(error.status || 400).send(error.message)
        }
    }) 
   }

   Delete(path: string) {
    return this.router.delete(path,this.md.Auth,(req,res) => {
        try {
            return this.homestayService.Delete(req,res)
        } catch (error) {
            return res.status(error.status || 400).send(error.message)
        }
    }) 
   }

   GetAll(path: string) {
    return this.router.get(path,(req,res) => {
        try {
            return this.homestayService.GetAll(req,res)
        } catch (error) {
            return res.status(error.status || 400).send(error.message)
        }
    }) 
   }
} 