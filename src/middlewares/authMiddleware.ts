import {Request, Response, NextFunction} from "express";
import admin from "../config/firebase";

export interface AuthRequest extends Request {
 user?: {uid: string; email?: string};
}


export const authMiddleware = async (
 req: AuthRequest,
 res: Response,
 next: NextFunction
) => {
 try {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
   return res.status(401).json({error: "No token provided"});
  }

  const idToken = header.split(" ")[1];

  const decoded = await admin.auth().verifyIdToken(idToken);
  req.user = {uid: decoded.uid, email: decoded.email};
  next();
 } catch (err) {
  console.error("authMiddleware error:", err);
  return res.status(403).json({error: "Invalid or expired token"});
 }
};
