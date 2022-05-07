import { RoomType } from "../models/model";
import { Room } from "../models/model.room";

export const roomData: Room[] = [
    {
        id: "1",
        homestayId: "1",
        roomType: RoomType.SINGLE,
        occupancy: 1,
        price: 2000
    },
    {
        id: "2",
        homestayId: "1",
        roomType: RoomType.DOUBLE,
        occupancy: 2,
        price: 3500
    },
    {
        id: "3",
        homestayId: "2",
        roomType: RoomType.SUITE,
        occupancy: 2,
        price: 4500,
    }, 
    {
        id: "4",
        homestayId: "2",
        roomType: RoomType.DOUBLE,
        occupancy: 2,
        price: 3300,
    }
]