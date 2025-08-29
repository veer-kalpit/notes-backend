// src/config/firebase.ts
import admin from "firebase-admin";
import path from "path";
import fs from "fs";

const keyPath = path.resolve(__dirname, "../../notes-bc6bc-firebase-adminsdk-fbsvc-d5cdbdca1c.json");

// sanity check
if (!fs.existsSync(keyPath)) {
 console.error(
  `Firebase service account key not found at ${keyPath}. Place your service account JSON there (backend/notes-bc6bc-firebase-adminsdk-fbsvc-d5cdbdca1c.json).`
 );
}

const serviceAccount = fs.existsSync(keyPath) ? require(keyPath) : undefined;

if (!admin.apps.length) {
 if (!serviceAccount) {
  console.warn(
   "Firebase Admin initialized without credentials — auth verification will fail."
  );
  admin.initializeApp();
 } else {
  admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
  });
 }
}

export default admin;
