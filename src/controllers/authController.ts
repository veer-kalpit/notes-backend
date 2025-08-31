import {sendVerificationEamil, sendWelcomeEmail} from "../middlewares/Email";
import {generateTokenAndSetCookies} from "../middlewares/GenerateToken";
import {Usermodel} from "../models/User";
import bcryptjs from "bcryptjs";
import {Request, Response} from "express";

// Send OTP for login
export const sendLoginOtp = async (req: Request, res: Response) => {
 try {
  const {email} = req.body;
  if (!email) {
   return res.status(400).json({success: false, message: "Email is required"});
  }
  const user = await Usermodel.findOne({email});
  if (!user) {
   return res.status(404).json({success: false, message: "User not found"});
  }
  if (!user.isVerified) {
   return res.status(403).json({success: false, message: "Email not verified"});
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.loginOtp = otp;
  user.loginOtpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await user.save();
  // Reuse verification email template for OTP
  await sendVerificationEamil(user.email, otp);
  return res.status(200).json({success: true, message: "OTP sent to email"});
 } catch (error) {
  console.log(error);
  return res
   .status(500)
   .json({success: false, message: "Internal server error"});
 }
};

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
  const {email, code} = req.body;
  if (!email || !code) {
   return res
    .status(400)
    .json({success: false, message: "Email and code are required"});
  }
  const user = await Usermodel.findOne({
   email,
   verficationToken: code,
   verficationTokenExpiresAt: {$gt: Date.now()},
  });
  if (!user) {
   return res
    .status(400)
    .json({success: false, message: "Invalid or Expired Code"});
  }

  user.isVerified = true;
  user.verficationToken = undefined;
  user.verficationTokenExpiresAt = undefined;
  await user.save();
  await sendWelcomeEmail(user.email, user.name);
  return res
   .status(200)
   .json({success: true, message: "Email Verified Successfully"});
 } catch (error) {
  console.log(error);
  return res
   .status(400)
   .json({success: false, message: "internal server error"});
 }
};

const Login = async (req: Request, res: Response): Promise<Response> => {
 try {
  const {email, password, otp} = req.body;
  if (!email || (!password && !otp)) {
   return res
    .status(400)
    .json({success: false, message: "Email and password or OTP are required"});
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
  // Password login
  if (password) {
   const isMatch = await bcryptjs.compare(password, user.password);
   if (!isMatch) {
    return res
     .status(400)
     .json({success: false, message: "Invalid credentials"});
   }
  } else if (otp) {
   if (
    !user.loginOtp ||
    !user.loginOtpExpiresAt ||
    user.loginOtp !== otp ||
    user.loginOtpExpiresAt < new Date()
   ) {
    return res
     .status(400)
     .json({success: false, message: "Invalid or expired OTP"});
   }
   // Clear OTP after successful login
   user.loginOtp = undefined;
   user.loginOtpExpiresAt = undefined;
  }
  user.lastLogin = new Date();
  await user.save();
  const token = generateTokenAndSetCookies(res, user._id.toString());
  return res.status(200).json({
   success: true,
   message: "Login successful",
   token,
   name: user.name,
   email: user.email,
  });
 } catch (error) {
  console.log(error);
  return res
   .status(500)
   .json({success: false, message: "Internal server error"});
 }
};

export {Reigster, VerfiyEmail, Login};
