import express from "express";
import dotenv from "dotenv";
import { create } from "../controllers/video-call";
dotenv.config();
const router = express.Router();

const DAILY_API_KEY = process.env.DAILY_API_KEY;

// 1️⃣ Mentee Creates/Joins a Room
router.post("/create-room", create);
router.post("//daily-webhook",transcript)

export default router;
