import {transporter} from "./Email.confiq";
import {
 Verification_Email_Template,
 Welcome_Email_Template,
} from "./EmailTemplate";
import {SentMessageInfo} from "nodemailer";

export const sendVerificationEamil = async (
 email: string,
 verificationCode: string
): Promise<void> => {
 try {
  const response: SentMessageInfo = await transporter.sendMail({
   from: '"Kalpit Thakur" <veerkalpit@gmail.com>',
   to: email, 
   subject: "Verify your Email", 
   text: "Verify your Email",
   html: Verification_Email_Template.replace(
    "{verificationCode}",
    verificationCode
   ),
  });
  console.log("Email send Successfully", response);
 } catch (error) {
  console.log("Email error", error);
 }
};

export const sendWelcomeEmail = async (
 email: string,
 name: string
): Promise<void> => {
 try {
  const response: SentMessageInfo = await transporter.sendMail({
   from: '"Kalpit Thakur" <veerkalpit@gmail.com>',
   to: email, 
   subject: "Welcome Email", 
   text: "Welcome Email",
   html: Welcome_Email_Template.replace("{name}", name),
  });
  console.log("Email send Successfully", response);
 } catch (error) {
  console.log("Email error", error);
 }
};
