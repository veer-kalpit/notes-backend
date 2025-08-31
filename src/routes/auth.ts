import express from "express";
import {
 Reigster,
 VerfiyEmail,
 Login,
 sendLoginOtp,
} from "../controllers/authController";

const AuthRoutes = express.Router();

AuthRoutes.post("/register", Reigster);
AuthRoutes.post("/verifyEmail", VerfiyEmail);
AuthRoutes.post("/login", Login);
AuthRoutes.post("/request-otp", sendLoginOtp);

export default AuthRoutes;
