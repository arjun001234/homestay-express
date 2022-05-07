import { homestayData } from "../data/homestay.data";
import { Exceptions, HomestayRepo, RepoResponse } from "../models/model";
import { Homestay } from "../models/model.homestay";
import { RepoClass } from "./repo";

export class HomestayRepoClass extends RepoClass<Homestay> implements HomestayRepo {
     constructor(){
         super(homestayData)
     }
    Search(key: string,value: string) : Homestay[] {
        return this.store.filter(hs => hs[key].toLowerCase().includes(value.toLowerCase()))
    }
}