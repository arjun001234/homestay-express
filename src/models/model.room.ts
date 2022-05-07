import { Equals, IsDefined, IsNumber, IsString, Max } from "class-validator";
import { RoomType } from "./model";
import { Homestay } from "./model.homestay";

export class NewRoomDto {
  @IsDefined()
  @Equals(RoomType.DOUBLE || RoomType.SINGLE || RoomType.SUITE)
  roomType: RoomType

  @IsDefined()
  @IsNumber()
  @Max(10)
  occupancy: number

  @IsDefined()
  @IsNumber()
  price: number

  @IsDefined()
  @IsString()
  homestayId: string
}


export interface Room {
    id: string,
    homestayId: string,
    roomType: RoomType,
    occupancy: number,
    price: number
}