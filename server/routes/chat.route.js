import express from "express";
import { createChat } from "../controllers/chat.controller.js"
import { requireAuth } from "../middleware/auth.middleware.js";

const chatRouter = express.Router();

chatRouter.post("/chat", requireAuth, createChat);

export default chatRouter;
