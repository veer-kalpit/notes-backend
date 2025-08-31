const Login = async (req: Request, res: Response): Promise<Response> => {
 try {
  const {email, password} = req.body;
  if (!email || !password) {
   return res
    .status(400)
    .json({success: false, message: "Email and password are required"});
  }
  const user = await Usermodel.findOne({email});
  if (!user) {
   return res
    .status(400)
    .json({success: false, message: "Invalid credentials"});
  }
  if (!user.isVerified) {
   return res.status(403).json({success: false, message: "Email not verified"});
  }
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
   return res
    .status(400)
    .json({success: false, message: "Invalid credentials"});
  }
  user.lastLogin = new Date();
  await user.save();
  const token = generateTokenAndSetCookies(res, user._id.toString());
  return res
   .status(200)
   .json({success: true, message: "Login successful", token});
 } catch (error) {
  console.log(error);
  return res
   .status(500)
   .json({success: false, message: "Internal server error"});
 }
};
import {sendVerificationEamil, sendWelcomeEmail} from "../middlewares/Email";
import {generateTokenAndSetCookies} from "../middlewares/GenerateToken";
import {Usermodel} from "../models/User";
import bcryptjs from "bcryptjs";
import {Request, Response} from "express";

const Reigster = async (req: Request, res: Response): Promise<Response> => {
 try {
  const {email, password, name} = req.body;
  if (!email || !password || !name) {
   return res
    .status(400)
    .json({success: false, message: "All fields are required"});
  }
  const ExistsUser = await Usermodel.findOne({email});
  if (ExistsUser) {
   return res
    .status(400)
    .json({success: false, message: "User Already Exists Please Login"});
  }
  const hasePassowrd = await bcryptjs.hashSync(password, 10);
  const verficationToken = Math.floor(
   100000 + Math.random() * 900000
  ).toString();
  const user = new Usermodel({
   email,
   password: hasePassowrd,
   name,
   verficationToken,
   verficationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });
  await user.save();
  generateTokenAndSetCookies(res, user._id.toString());
  await sendVerificationEamil(user.email, verficationToken);
  return res
   .status(200)
   .json({success: true, message: "User Register Successfully", user});
 } catch (error) {
  console.log(error);
  return res
   .status(400)
   .json({success: false, message: "internal server error"});
 }
};

const VerfiyEmail = async (req: Request, res: Response): Promise<Response> => {
 try {
  const {code} = req.body;
  const user = await Usermodel.findOne({
   verficationToken: code,
   verficationTokenExpiresAt: {$gt: Date.now()},
  });
  if (!user) {
   return res
    .status(400)
    .json({success: false, message: "Inavlid or Expired Code"});
  }

  user.isVerified = true;
  user.verficationToken = undefined;
  user.verficationTokenExpiresAt = undefined;
  await user.save();
  await sendWelcomeEmail(user.email, user.name);
  return res
   .status(200)
   .json({success: true, message: "Email Verifed Successfully"});
 } catch (error) {
  console.log(error);
  return res
   .status(400)
   .json({success: false, message: "internal server error"});
 }
};

export {Reigster, VerfiyEmail, Login};
