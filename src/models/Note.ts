// src/models/Note.ts
import {Schema, model, Document} from "mongoose";

export interface INote extends Document {
 text: string;
 userId: string; // firebase uid
 createdAt: Date;
 updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
 {
  text: {type: String, required: true},
  userId: {type: String, required: true, index: true},
 },
 {timestamps: true}
);

export default model<INote>("Note", NoteSchema);
