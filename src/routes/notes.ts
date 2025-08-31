import {Router} from "express";
import Note from "../models/Note";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

router.get("/", async (req, res) => {
 try {
  const token =
   req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
  if (!token) {
   return res.status(401).json({error: "No token provided"});
  }
  let decoded: any;
  try {
   decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err) {
   return res.status(401).json({error: "Invalid or expired token"});
  }
  const uid =
   typeof decoded === "object" && decoded.userId ? decoded.userId : null;
  if (!uid) {
   return res.status(401).json({error: "Invalid token payload"});
  }
  // Check if user exists and is verified
  const {Usermodel} = require("../models/User");
  const user = await Usermodel.findById(uid);
  if (!user || !user.isVerified) {
   return res.status(403).json({error: "User not registered or not verified"});
  }
  const notes = await Note.find({userId: uid}).sort({createdAt: -1});
  res.json(notes);
 } catch (err) {
  console.error("GET /api/notes error:", err);
  res.status(500).json({error: "Failed to fetch notes"});
 }
});

router.post("/", async (req, res) => {
 try {
  const token =
   req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
  if (!token) {
   return res.status(401).json({error: "No token provided"});
  }
  let decoded: any;
  try {
   decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err) {
   return res.status(401).json({error: "Invalid or expired token"});
  }
  const uid =
   typeof decoded === "object" && decoded.userId ? decoded.userId : null;
  if (!uid) {
   return res.status(401).json({error: "Invalid token payload"});
  }
  // Check if user exists and is verified
  const {Usermodel} = require("../models/User");
  const user = await Usermodel.findById(uid);
  if (!user || !user.isVerified) {
   return res.status(403).json({error: "User not registered or not verified"});
  }
  const {text} = req.body;
  if (!text || typeof text !== "string" || !text.trim()) {
   return res.status(400).json({error: "Note text is required"});
  }
  const note = await Note.create({content: text.trim(), user: uid});
  res.status(201).json(note);
 } catch (err) {
  console.error("POST /api/notes error:", err);
  res.status(500).json({error: "Failed to create note"});
 }
});

router.delete("/:id", async (req, res) => {
 try {
  const token =
   req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
  if (!token) {
   return res.status(401).json({error: "No token provided"});
  }
  let decoded: any;
  try {
   decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err) {
   return res.status(401).json({error: "Invalid or expired token"});
  }
  const uid =
   typeof decoded === "object" && decoded.userId ? decoded.userId : null;
  if (!uid) {
   return res.status(401).json({error: "Invalid token payload"});
  }
  // Check if user exists and is verified
  const {Usermodel} = require("../models/User");
  const user = await Usermodel.findById(uid);
  if (!user || !user.isVerified) {
   return res.status(403).json({error: "User not registered or not verified"});
  }
  const id = req.params.id;
  const deleted = await Note.findOneAndDelete({_id: id, userId: uid});
  if (!deleted) return res.status(404).json({error: "Note not found"});
  res.json({message: "Deleted", id: deleted._id});
 } catch (err) {
  console.error("DELETE /api/notes/:id error:", err);
  res.status(500).json({error: "Failed to delete note"});
 }
});

export default router;
