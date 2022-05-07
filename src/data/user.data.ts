import { UserRole } from "../models/model";
import { User } from "../models/model.user";

export const userData: User[] = [
    {
        id: "1",
        name: 'arjun',
        email: 'arjunkanojia001@gmail.com',
        password: 'arjun@12345',
        role: UserRole.ADMIN
    },
    {
        id: "2",
        name: 'shikhar',
        email: 'shikharkapasia@gmail.com',
        password: 'arjun@12345',
        role: UserRole.USER
    }
]