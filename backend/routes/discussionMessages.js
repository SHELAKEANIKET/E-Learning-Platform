import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getDiscussionMessages } from "../controllers/discussionMessages.js";

const router = express.Router();

router.get("/:courseId", authMiddleware, getDiscussionMessages);

export default router;
