import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
	addReaction,
	getDiscussionMessages,
} from "../controllers/discussionMessages.js";

const router = express.Router();

router.get("/:courseId", authMiddleware, getDiscussionMessages);
router.post("/:messageId/reactions", authMiddleware, addReaction);

export default router;
