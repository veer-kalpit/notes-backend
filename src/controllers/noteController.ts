import {Request, Response} from "express";
import Note from "../models/Note";

export const getNotes = async (req: Request, res: Response) => {
 try {
  const notes = await Note.find({user: req.userId});
  res.status(200).json({success: true, notes});
 } catch (error) {
  res.status(500).json({success: false, message: "Failed to fetch notes"});
 }
};

export const createNote = async (req: Request, res: Response) => {
 try {
  const {heading, content} = req.body;
  if (!heading || !content) {
   return res
    .status(400)
    .json({success: false, message: "Heading and content are required"});
  }
  // @ts-ignore
  const note = await Note.create({user: req.userId, heading, content});
  res.status(201).json({success: true, note});
 } catch (error) {
  res.status(500).json({success: false, message: "Failed to create note"});
 }
};


export const updateNote = async (req: Request, res: Response) => {
 try {
  const {id} = req.params;
  const {heading, content} = req.body;

  if (!heading || !content) {
   return res
    .status(400)
    .json({success: false, message: "Heading and content are required"});
  }

  // @ts-ignore
  const note = await Note.findOneAndUpdate(
   {_id: id, user: req.userId},
   {heading, content},
   {new: true}
  );

  if (!note) {
   return res
    .status(404)
    .json({success: false, message: "Note not found or unauthorized"});
  }

  res.status(200).json({success: true, note});
 } catch (error) {
  res.status(500).json({success: false, message: "Failed to update note"});
 }
};


export const deleteNote = async (req: Request, res: Response) => {
 try {
  const {id} = req.params;
  // @ts-ignore
  const note = await Note.findOneAndDelete({_id: id, user: req.userId});
  if (!note) {
   return res
    .status(404)
    .json({success: false, message: "Note not found or unauthorized"});
  }
  res.status(200).json({success: true, message: "Note deleted"});
 } catch (error) {
  res.status(500).json({success: false, message: "Failed to delete note"});
 }
};
