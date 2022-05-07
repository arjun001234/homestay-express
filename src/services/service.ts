import { Request,Response} from 'express'
import { Exceptions, RepoResponse } from '../models/model'
import { RepoClass } from '../repos/repo'

export interface ServiceType  {
    Create: (req: Request,res: Response) => void
    Get: (req: Request,res: Response) => void
    Update: (req: Request,res: Response) => void
    Delete: (req: Request,res: Response) => void
    GetAll: (req: Request,res: Response) => void
}

export abstract class ServiceClass<T extends {Find: (id: string) => RepoResponse<U>},U> implements ServiceType {
   protected repo: T
   constructor(repo: T){
       this.repo = repo
   }
   abstract  Create(req: Request,res: Response) : void
   abstract  Get(req: Request,res: Response) : void
   abstract  Update(req: Request,res: Response) : void
   abstract  Delete(req: Request,res: Response) : void
   abstract  GetAll(req: Request,res: Response) : void

   Find(id: string,res: Response,message: string) : U {
    if (!id) {
        res.send(403).send({message: "id not provided"})
        return
    }
    const result = this.repo.Find(id)
    if (result === Exceptions.NOT_FOUND){
        res.status(404).send({message: message})
        return
    }
    return result as U
   } 
}