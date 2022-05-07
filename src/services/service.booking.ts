import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { v4 } from "uuid";
import { Exceptions } from "../models/model";
import { Booking, NewBookingDto } from "../models/model.booking";
import { Homestay } from "../models/model.homestay";
import { Room } from "../models/model.room";
import { HomestayRepoClass } from "../repos/homestay.repo";
import { BookingRepo } from "../repos/repo.booking";
import { ValidateBody, VerifyId } from "../utils/decorator";
import { ServiceClass } from "./service";

export class BookingService extends ServiceClass<BookingRepo, Booking> {
    homestayRepo: HomestayRepoClass
    constructor(repo: BookingRepo, homestayRepo: HomestayRepoClass) {
        super(repo)
        this.homestayRepo = homestayRepo
    }

    private getTotalPrice(homestay: Homestay, rooms: { quantity: number, roomId: string }[],bookingRooms: {quantity: number,room: Room}[]): number | Exceptions.NOT_FOUND {
        let totalPrice: number = 0
        console.log(rooms)
        rooms.map((val) => {
            console.log(val)
            let isFound: boolean = false
            let currRoom: Room
            homestay.rooms.map((room) => {
                console.log(room.id,val.roomId)
                if (room.id === val.roomId) {
                    isFound = true
                    currRoom = room
                }
            })
            console.log(isFound)
            if (!isFound) {
                return Exceptions.NOT_FOUND
            }
            console.log(val)
            console.log(currRoom)
            totalPrice += val.quantity * currRoom.price
            bookingRooms.push({
                quantity: val.quantity,
                room: currRoom
            })
        })
        return totalPrice
    }

    @ValidateBody(NewBookingDto, {})
    Create(req: Request<ParamsDictionary, any, NewBookingDto, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): void {
        const input = req.body
        const user = req.session.user

        console.log(req.body.rooms[0])

        const result = this.homestayRepo.Find(input.homestayId)
        if (result === Exceptions.NOT_FOUND) {
            res.status(404).send({ message: "homestay not found" })
            return
        }

        delete input.homestayId

        const rooms : {quantity: number,room: Room}[] = [] 

        const totalPrice = this.getTotalPrice(result,input.rooms,rooms)
        console.log(totalPrice)
        if (totalPrice === Exceptions.NOT_FOUND){
            res.status(404).send({ message: "room not found" })
            return
        }

        // console.log(rooms)

        delete input.rooms

        const booking: Booking = {
            id: v4(),
            homestay: result as Homestay,
            user: user,
            bookingDate: new Date().toTimeString(),
            totalPrice: totalPrice as number,
            from: input.from,
            to: input.to,
            rooms: rooms
        }

        this.repo.Create(booking)

        res.status(201).send(booking)
    }


    GetUserBookings(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) : void {
        console.log(req.user)
        const bookings = this.repo.UserBookings(req.user.id)
        res.status(200).send(bookings)
    }

    Update(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): void {}

    @VerifyId(true)
    Delete(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): void {
        const booking = this.Find(req.params.id,res,"booking not found")
        this.repo.Delete(booking.id)
        res.status(200).send(booking)
    }

    // @VerifyId(false)
    Get(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): void {
        const booking = this.Find(req.params.id,res,"booking not found")
        // console.log(booking)
        res.status(200).send(booking)
    }

    GetAll(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): void {
        res.status(200).send(this.repo.FindAll())
    }
}
