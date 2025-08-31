import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
 host: "smtp.gmail.com",
 port: 587,
 secure: false,
 auth: {
  user: "veerkalpit@gmail.com",
  pass: "nntfvyvvtcslegfx",
 },
});
