import { Equals, IsArray, IsDate, IsDefined, IsString } from "class-validator";
import { PaymentType, RoomType } from "./model";
import { Homestay } from "./model.homestay";
import { Room } from "./model.room";
import { User } from "./model.user";

export class NewBookingDto {

    @IsDefined()
    @IsString()
    homestayId: string

    @IsDefined()
    @IsString()
    from: string

    @IsDefined()
    @IsString()
    to: string

    @IsDefined()
    @IsArray()
    rooms: {
        quantity: number,
        roomId: string
    }[]
}


export interface Booking {
    id: string,
    user: User,
    homestay: Homestay,
    bookingDate: string,
    from: string,
    to: string,
    totalPrice: number,
    rooms: {
        quantity: number,
        room: Room
    }[]
}