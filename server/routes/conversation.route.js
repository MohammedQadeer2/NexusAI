import express from "express";
import {
    createConversation,
    deleteConversation,
    getConversations,
    getMessages
} from "../controllers/conversation.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const conversationRouter = express.Router();

conversationRouter.use(requireAuth);

conversationRouter.post("/", createConversation);
conversationRouter.get("/", getConversations);
conversationRouter.get("/:conversationId/messages", getMessages);
conversationRouter.delete("/:conversationId", deleteConversation);

export default conversationRouter;
