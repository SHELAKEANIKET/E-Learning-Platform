import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  addReview,
  deleteReview,
  getCourseReviews,
  updateReview,
} from "../controllers/reviewController.js";
const router = express.Router();

router.post("/add/:courseId", authMiddleware, addReview);
router.get("/all/:courseId", authMiddleware, getCourseReviews);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

export default router;
