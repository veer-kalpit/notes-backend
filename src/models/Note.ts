import mongoose, {Document, Schema} from "mongoose";

export interface INote extends Document {
 user: mongoose.Types.ObjectId;
 content: string;
}

const noteSchema = new Schema<INote>(
 {
  user: {type: Schema.Types.ObjectId, ref: "User", required: true},
  content: {type: String, required: true},
 },
 {timestamps: true}
);

export default mongoose.model<INote>("Note", noteSchema);
