import { userData } from "../data/user.data";
import { Exceptions, RepoResponse, UserRepo } from "../models/model";
import { User } from "../models/model.user";
import { RepoClass } from "./repo";

export class UserRepoClass extends RepoClass<User> implements UserRepo {
    constructor() {
        super(userData)
    }
    FindUserByEmail(email: string) : RepoResponse<User> {
       const user = this.store.find(user => user.email === email)
       if (user !== undefined) {
          return user
       }else {
           return Exceptions.NOT_FOUND
       }
    }
}