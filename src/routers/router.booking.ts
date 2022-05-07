import { RouterClass } from './router'
import { Middleware } from "../helpers/midddleware";
import { BookingService } from '../services/service.booking';

interface BookingRouterType {

}

export class BookingRouter extends RouterClass implements BookingRouterType {
    protected bookingService: BookingService
    constructor(bookingService: BookingService,md: Middleware) {
        super("/booking", md)
        this.init()
        this.bookingService = bookingService
    }

    init(): void {
        this.GetUserBookings("/user")
        this.Create("")
        this.Delete("/:id")
        this.Get("/:id")
        this.GetAll("")
    }

    Create(path: string) {
        this.router.post(path,this.md.Auth(),(req, res) => {
            try {
                return this.bookingService.Create(req, res);
            } catch (error) {
                return res.status(error.status || 400).send(error.message)
            }
        })
    }

    Delete(path: string) {
        this.router.delete(path,this.md.Auth,(req, res) => {
            try {
                return this.bookingService.Delete(req, res);
            } catch (error) {
                return res.status(error.status || 400).send(error.message)
            }
        })
    }

    Get(path: string) {
        this.router.get(path,(req, res) => {
            try {
                return this.bookingService.Get(req, res);
            } catch (error) {
                return res.status(error.status || 400).send(error.message)
            }
        })
    }

    GetAll(path: string) {
        this.router.get(path,(req, res) => {
            try {
                return this.bookingService.GetAll(req, res);
            } catch (error) {
                return res.status(error.status || 400).send(error.message)
            }
        })
    }

    GetUserBookings(path: string){
        this.router.get(path,this.md.Auth(),(req, res) => {
            try {
                return this.bookingService.GetUserBookings(req, res);
            } catch (error) {
                return res.status(error.status || 400).send(error.message)
            }
        })
    }
}