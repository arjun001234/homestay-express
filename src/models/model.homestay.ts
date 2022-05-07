import { Type } from "class-transformer"
import { IsDefined, IsString, Length, ValidateNested } from "class-validator"
import { NewRoomDto, Room } from "./model.room"

export class UpdateHomeStayDto {
    @IsDefined()
    @IsString()
    @Length(3,50)
    name: string

    @IsDefined()
    @IsString()
    desc: string

    @IsDefined()
    @IsString()
    address: string

    @IsDefined()
    @IsString()
    state: string

    @IsDefined()
    @IsString()
    city: string

    @IsDefined()
    @IsString()
    pincode: string

    @IsDefined()
    @IsString()
    country: string
}

export class NewHomestayDto extends UpdateHomeStayDto {

    @ValidateNested({each: true})
    @Type(() => NewRoomDto)
    rooms: Room[]
}

export interface Homestay {
    id: string,
    name: string,
    desc: string,
    address: string,
    state: string,
    city: string,
    pincode: string,
    country: string,
    img: string[]
    rooms: Room[]
}