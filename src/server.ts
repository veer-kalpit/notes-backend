import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import {connectDB} from "./config/db";
import noteRoutes from "./routes/note";

dotenv.config();

const app = express();
app.use(express.json());

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(
 cors({
  origin: corsOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
 })
);

app.get("/health", (_, res) => res.json({status: "ok"}));
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
 console.error("MONGO_URI is not set. See .env");
 process.exit(1);
}

connectDB(MONGO_URI).then(() => {
 app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Allowed CORS origin: ${corsOrigin}`);
  console.log(`Health: GET http://localhost:${PORT}/health`);
 });
});
