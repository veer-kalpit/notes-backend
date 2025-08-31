import {Request} from "express";

declare global {
 namespace Express {
  interface Request {
   userId?: string;
  }
 }
}
import {IUser} from "../../models/User";

declare global {
 namespace Express {
  interface Request {
   user?: IUser | null;
  }
 }
}
