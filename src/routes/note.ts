import {Router} from "express";
import {
 getNotes,
 createNote,
 updateNote,
 deleteNote,
} from "../controllers/noteController";
import {authenticateJWT} from "../middlewares/GenerateToken";

const noteRouter = Router();

noteRouter.get("/", authenticateJWT, getNotes);
noteRouter.post("/", authenticateJWT, createNote);
noteRouter.put("/:id", authenticateJWT, updateNote);
noteRouter.delete("/:id", authenticateJWT, deleteNote);

export default noteRouter;
