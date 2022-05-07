import { BookingData } from "../data/booking.data";
import { Repo } from "../models/model";
import { Booking } from "../models/model.booking";
import { RepoClass } from "./repo";

export interface BookingRepoType extends Repo<Booking> {}

export class BookingRepo extends RepoClass<Booking> implements BookingRepoType  {
   constructor(){
       super(BookingData)
   }
   UserBookings(userId: string) : Booking[] {
        return this.store.filter(booking => booking.user.id === userId)
   }
}