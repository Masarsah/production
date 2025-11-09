import express from "express";
import * as chatController from "../controller/chat.js";

const router = express.Router();

// إرسال رسالة + رد AI
router.post("/", chatController.sendMessage);

// استرجاع المحادثة حسب المستخدم
router.get("/:userId", chatController.getChatHistory);

export default router;
