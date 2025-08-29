import express from "express";
import admin from "firebase-admin";

const router = express.Router();

// POST /api/auth/google
router.post("/google", async (req, res) => {
 const {idToken} = req.body;
 if (!idToken) return res.status(400).json({error: "Missing Google ID token"});
 try {
  const decoded = await admin.auth().verifyIdToken(idToken);
  // Optionally create user in DB here
  // Issue JWT (here, Firebase token is used)
  res.json({uid: decoded.uid, email: decoded.email, token: idToken});
 } catch (err) {
  res.status(401).json({error: "Invalid Google token"});
 }
});

// POST /api/auth/email-otp (for custom OTP, not magic link)
// router.post("/email-otp", ...)

export default router;
