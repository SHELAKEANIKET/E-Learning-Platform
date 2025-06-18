import express from "express";
import {
  enrollInCourse,
  getEnrollmentByCourseId,
  getMonthlyRevenue,
  markProgress,
} from "../controllers/enrollmentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/enroll/:courseId", authMiddleware, enrollInCourse);
router.get("/revenue", authMiddleware, getMonthlyRevenue);
router.post("/progress", authMiddleware, markProgress);
router.get(
  "/getenrollment/:courseId",
  authMiddleware,
  getEnrollmentByCourseId
);

export default router;
