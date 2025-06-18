import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  addReview,
  deleteReview,
  updateReview,
} from "../controllers/reviewController.js";
const router = express.Router();

router.post("/", authMiddleware, addReview);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

export default router;
