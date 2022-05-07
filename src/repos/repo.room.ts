import { roomData } from "../data/room.data";
import { Repo } from "../models/model";
import { Room } from "../models/model.room";
import { RepoClass } from "./repo";

export interface RoomRepoType extends Repo<Room> {
    FindRoomsByHomestayId: (id: string) => Room[]
}

export class RoomRepo extends RepoClass<Room> implements RoomRepoType {
    constructor() {
        super(roomData)
    }
    FindRoomsByHomestayId(id: string) : Room[] {
        return this.store.filter(room => room.homestayId === id)
   }
}