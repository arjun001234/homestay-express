import { Request, Response, } from "express"
import { Http2ServerRequest } from "http2"
import { Booking } from "./model.booking"
import { Homestay } from "./model.homestay"
import { Room } from "./model.room"
import { User } from "./model.user"

export enum UserRole  {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export enum RoomType {
    SINGLE = 'SINGLE',
    DOUBLE = 'DOUBLE',
    SUITE = 'SUITE',
}

export enum PaymentType {
   PAYTM = 'PAYTM',
   NET_BANKING = 'NET BANKING',
   CARD = "CARD"
}

export enum Exceptions {
    NOT_FOUND = "NOT FOUND"
}

export interface ResponseErrorType {
    status: number,
    error: any
}

export type RepoResponse<T> = T | Exceptions

export interface Repo<T> {
    Create: (payload: T) => T,
    Delete: (id: string) => RepoResponse<T>,
    Update: (payload: T) => RepoResponse<T>,
    Find: (id: string) => RepoResponse<T>,
    FindAll: () => T[]
}

export interface UserRepo extends Repo<User> {
    FindUserByEmail: (email: string) => RepoResponse<User>,
}

export interface HomestayRepo extends Repo<Homestay> {
    Search: (key: string,value: string) => Homestay[] 
}

export interface RoomRepo extends Repo<Room> {
    FindRoomsByHomestayId: (id: string) => Room[]
}

export interface BookingRepo extends Repo<Booking> {
    FindUserBookings: (id: string) => Booking[]
    FindHomeStayBookings: (id: string) => Booking[]
}