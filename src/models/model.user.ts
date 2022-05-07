import { Equals, IsDefined, IsEmail, IsEmpty, IsOptional, IsString, Length, matches, Matches } from "class-validator"
import { UserRole } from "./model"

export class UserLoginDto {

    @IsDefined({message: "email not provided"})
    @IsString({message: "email must be a string"})
    @Matches(/^\S+@\S+\.\S+$/)
    email: string

    @IsDefined({message: "password not provided"})
    @IsString({message: "password should be a string"})
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    password: string

}

export class NewUserDto extends UserLoginDto {

    @IsDefined({message: "name not provided"})
    @IsString({message: "name must be a string"})
    @Length(3,20,{message: "name should be more than 3 characters and less than 20 characters"})
    name: string
 
}

export class UpdateUserDto extends NewUserDto {}

export interface User {
    id: string,
    name: string,
    email: string,
    password: string,
    role: UserRole
}