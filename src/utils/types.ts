import { User } from "../models/model.user";

declare module 'express-session' {
    interface SessionData {
        user: User
    }
}

declare global {
    namespace Express {
      interface Request {
        user: User
      }
    }
  }