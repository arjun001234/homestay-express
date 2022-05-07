import { Router } from "express"
import { Middleware } from "../helpers/midddleware"
import { Singelton } from "../utils/decorator"
import { RouterClass } from "./router"

interface AppRouterType {
    HomePage: () => void
    loginPage: () => void
    registerPage: () => void
}


@Singelton()
export class AppRouter extends RouterClass implements AppRouterType {
    protected path: string
    constructor(md: Middleware){
        super("/",md)
        this.router = Router()
        this.path = ""
        this.init()
    }
    init() {
        this.HomePage()
        this.loginPage()
        this.registerPage()
    }
    HomePage() : void {
        this.router.get(this.path,(_,res) => {
            return res.render("index")
        })
    }
    loginPage() : void {
        this.router.get("/login",(_,res) => {
            return res.render("login")
        })
     }
     registerPage() : void {
         this.router.get("/register",(_,res) => {
            return res.render("register")
         })
      }
}