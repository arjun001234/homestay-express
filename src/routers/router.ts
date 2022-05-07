import { Router } from "express"
import { Middleware } from "../helpers/midddleware"

export abstract class RouterClass {
    protected router : Router
    protected path : string
    protected md : Middleware
    abstract init() : void
    constructor(path: string,md: Middleware){
        this.router = Router()
        this.path = path
        this.md = md
    }
    getRouter() : Router {
        return this.router
    }
    getPath() : string {
        return this.path
    }
}