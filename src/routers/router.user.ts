import { Middleware } from "../helpers/midddleware"
import { ResponseErrorType } from "../models/model"
import { UserService, UserServiceType } from "../services/service.user"
import { Singelton } from "../utils/decorator"
import { RouterClass } from "./router"

interface UserRouterType {}

@Singelton()
export class UserRouter extends RouterClass implements UserRouterType {
    protected userService : UserServiceType
    constructor(service: UserServiceType,md: Middleware){
        super("/user",md)
        this.userService = service
        this.init()
    }
    init() : void {
         this.me("/me")
         this.GetUser("/:id")
         this.PostUser("")
         this.login("/login")
         this.GetAllUsers("")
         this.DeleteUser("/:id")
         this.UpdateUser("/:id")
         this.logout("/logout");
    }

    protected logout(path: string) : void {
        this.router.post(path,(req,res) => {
            try {
                return this.userService.logout(req,res) 
            } catch (error) {
                return res.status(error.status).send(error.message)
            }
        })
    }

    protected login(path: string) : void {
        this.router.post(path,(req,res) => {
            try {
                return this.userService.login(req,res) 
            } catch (error) {
                return res.status(error.status).send(error.message)
            }
        })
    }

    protected me(path: string): void {
        this.router.get(path,this.md.Auth(),(req,res) => {
            try {
                return this.userService.me(req,res) 
            } catch (error) {
                return res.status(error.status).send(error.message)
            }
        })
    }
    protected GetUser(path: string) : void {
        this.router.get(path,(req,res) => {
            try {
                return this.userService.Get(req,res)
            } catch (error) {
                return res.status(error.status).send(error.message)
            }
        })
    }


    protected PostUser(path: string) : void {
        this.router.post(path,(req,res) => {
            try {
                return this.userService.Create(req,res)
            } catch (error) {
                return res.status(error.status || 400).send(error.message)
            }
        })
    }

    protected DeleteUser(path: string) : void {
        this.router.delete(path,this.md.Auth,(req,res) => {
            try {
                return this.userService.Delete(req,res)
            } catch (error) {
                return res.status(error.status).send(error.message)
            }
        })
    }

    protected GetAllUsers(path: string): void {
        this.router.get(path,(req,res) => {
            try {
                return this.userService.GetAll(req,res)
            } catch (error) {
                return res.status(error.status).send(error.message)
            }
        })
    }

    protected UpdateUser(path: string): void {
        this.router.patch(path,this.md.Auth,(req,res) => {
            try {
                return this.userService.Update(req,res)
            } catch (error) {
                return res.status(error.status).send(error.message)
            }
        })
    }
}