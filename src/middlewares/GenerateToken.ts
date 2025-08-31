import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {Request, Response, NextFunction} from "express";

dotenv.config();

export const authenticateJWT = (
 req: Request,
 res: Response,
 next: NextFunction
) => {
 const authHeader = req.headers.authorization || req.cookies?.token;
 let token = null;
 if (
  authHeader &&
  typeof authHeader === "string" &&
  authHeader.startsWith("Bearer ")
 ) {
  token = authHeader.split(" ")[1];
 } else if (req.cookies?.token) {
  token = req.cookies.token;
 }
 if (!token) {
  return res.status(401).json({success: false, message: "No token provided"});
 }
 try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
   userId: string;
  };
  // @ts-ignore
  req.userId = decoded.userId;
  next();
 } catch (err) {
  return res.status(401).json({success: false, message: "Invalid token"});
 }
};

export const generateTokenAndSetCookies = (
 res: Response,
 userId: string
): string => {
 const token = jwt.sign({userId}, process.env.JWT_SECRET as string, {
  expiresIn: "7d",
 });

 res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
 });
 return token;
};
