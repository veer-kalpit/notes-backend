import {Router} from "express";
import Note from "../models/Note";
import {authMiddleware, AuthRequest} from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
 try {
  const uid = req.user!.uid;
  const notes = await Note.find({userId: uid}).sort({createdAt: -1});
  res.json(notes);
 } catch (err) {
  console.error("GET /api/notes error:", err);
  res.status(500).json({error: "Failed to fetch notes"});
 }
});


router.post("/", authMiddleware, async (req: AuthRequest, res) => {
 try {
  const uid = req.user!.uid;
  const {text} = req.body;
  if (!text || typeof text !== "string" || !text.trim()) {
   return res.status(400).json({error: "Note text is required"});
  }
  const note = await Note.create({text: text.trim(), userId: uid});
  res.status(201).json(note);
 } catch (err) {
  console.error("POST /api/notes error:", err);
  res.status(500).json({error: "Failed to create note"});
 }
});


router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
 try {
  const uid = req.user!.uid;
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
