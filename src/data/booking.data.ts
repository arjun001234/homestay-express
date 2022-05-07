import { PaymentType } from "../models/model";
import { Booking } from "../models/model.booking";
import { homestayData } from "./homestay.data";
import { roomData } from "./room.data";
import { userData } from "./user.data";


export const BookingData : Booking[] = [
    {
        id: "1",
        user: userData[0],
        homestay: homestayData[1],
        bookingDate: new Date().toLocaleString(),
        from: new Date("May 5").toLocaleString(),
        to: new Date("May 10").toLocaleString(),
        totalPrice: 45000,
        rooms: [{quantity: 2,room: roomData[2]},{quantity: 1,room: roomData[3]}]
    },
    {
        id: "2",
        user: userData[0],
        homestay: homestayData[0],
        bookingDate: new Date().toLocaleString(),
        from: new Date("May 3").toLocaleString(),
        to: new Date("May 7").toLocaleString(),
        totalPrice: 8000,
        rooms: [{quantity: 1,room: roomData[1]},{quantity: 1,room: roomData[0]}]
    }
]