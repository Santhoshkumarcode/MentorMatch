import express from "express"
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from "url";
import fs from "fs";


import summaryCltr from "../controllers/summary-cltr.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router()

const uploadPath = path.join(__dirname, "../uploads");
console.log("Uploading to:", uploadPath);
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + '.webm';
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });

router.post('/summaries/upload-audio', upload.single('audio'), summaryCltr.createAudio)
router.get('/summaries/:menteeId',summaryCltr.getSummary)

export default router