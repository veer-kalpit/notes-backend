import express from "express";
import {Reigster, VerfiyEmail, Login} from "../controllers/authController";

const AuthRoutes = express.Router();

AuthRoutes.post("/register", Reigster);
AuthRoutes.post("/verifyEmail", VerfiyEmail);
AuthRoutes.post("/login", Login);
export default AuthRoutes;
