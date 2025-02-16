import express from "express"
import { chatCltr } from "../controllers/chat-handler.js";

const router = express.Router()

router.get('/chats/:meetingId', chatCltr.getChat)

export default router