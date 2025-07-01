import express from "express";
const router = express.Router();
import { upload } from "../middlewares/multer.js";
import {
  addCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  uploadPDF,
} from "../controllers/courseController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

router.post(
  "/add",
  upload.fields([
    {
      name: "courseThumbnail",
      maxCount: 1,
    },
  ]),
  authMiddleware,
  addCourse
);
router.get("/", getAllCourses);
router.get("/instructor/courses", authMiddleware, getInstructorCourses);
router.get("/:id", getCourseById);
router.put(
  "/edit/:id",
  upload.fields([
    {
      name: "courseThumbnail",
      maxCount: 1,
    },
  ]),
  authMiddleware,
  updateCourse
);
router.delete("/:id", authMiddleware, deleteCourse);
router.post(
  "/:id/upload-pdf",
  upload.fields([
    {
      name: "pdf",
      maxCount: 1,
    },
  ]),
  authMiddleware,
  uploadPDF
);

export default router;
