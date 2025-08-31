import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {Response} from "express";

dotenv.config();

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
