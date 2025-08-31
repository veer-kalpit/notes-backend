import {Request, Response} from "express";
import Note from "../models/Note";

export const createNote = async (
 req: Request,
 res: Response
): Promise<void> => {
 try {
  const note = await Note.create({
   user: req.user!.id,
   content: req.body.content,
  });
  res.json({success: true, note});
 } catch {
  res.status(500).json({success: false, message: "Error creating note"});
 }
};

export const deleteNote = async (
 req: Request,
 res: Response
): Promise<void> => {
 try {
  const note = await Note.findOneAndDelete({
   _id: req.params.id,
   user: req.user!.id,
  });
  if (!note) {
   res.status(404).json({success: false, message: "Note not found"});
   return;
  }
  res.json({success: true, message: "Note deleted"});
 } catch {
  res.status(500).json({success: false, message: "Error deleting note"});
 }
};
