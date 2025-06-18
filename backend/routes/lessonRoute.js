import express from "express";
const router = express.Router();
import { upload } from "../middlewares/multer.js";
import {
  addLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
} from "../controllers/lessonController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

router.post(
  "/add/:courseId",
  upload.fields([
    {
      name: "videoUrl",
      maxCount: 1,
    },
  ]),
  authMiddleware,
  addLesson
);
router.get("/course/:courseId", getLessonsByCourse);
router.get("/:id", getLessonById);
router.put(
  "/edit/:id",
  upload.fields([
    {
      name: "videoUrl",
      maxCount: 1,
    },
  ]),
  authMiddleware,
  updateLesson
);
router.delete("/:id", authMiddleware, deleteLesson);

export default router;
