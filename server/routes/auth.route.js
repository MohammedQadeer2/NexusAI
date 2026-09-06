import express from "express";
import { signUp, signIn, signOut, getProfile } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signUp", signUp);
authRouter.post("/signIn", signIn);
authRouter.get("/signOut", requireAuth, signOut);
authRouter.get("/profile/:userId", requireAuth, getProfile);

export default authRouter;
