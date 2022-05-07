import { Homestay } from "../models/model.homestay";
import { roomData } from "./room.data";

export const homestayData: Homestay[] = [
    {
        id: "1",
        name: "K Block",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet odio vel lorem aliquam scelerisque. ",
        address: "Gadakhor Basti Village, Sector 43, Faridabad, Haryana 121004, India",
        country: "India",
        state: "Haryana",
        city: "Faridabad",
        img: ["http://localhost:4000/images/mr-2.jpg","http://localhost:4000/images/mr-3.jpg"],
        pincode: "121004",
        rooms: [roomData[0],roomData[1]]
    },
    {
        id: "2",
        name: "A Block",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet odio vel lorem aliquam scelerisque. ",
        address: "Gadakhor Basti Village, Sector 43, Faridabad, Haryana 121004, India",
        country: "India",
        state: "Haryana",
        city: "Faridabad",
        img: ["http://localhost:4000/images/mr-1.jpg","http://localhost:4000/images/mr-3.jpg"],
        pincode: "121004",
        rooms: [roomData[2],roomData[3]] 
    }
]