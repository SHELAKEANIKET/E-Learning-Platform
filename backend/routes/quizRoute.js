import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  addQuiz,
  deleteQuiz,
  getInstructorQuiz,
  getQuiz,
  getQuizById,
  getUserResults,
  handleSubmitQuiz,
  updateQuiz,
} from "../controllers/quizController.js";

const router = express.Router();

router.post("/add/:courseId", authMiddleware, addQuiz);
router.get("/:courseId", authMiddleware, getQuiz);
router.get("/instructor/:courseId", authMiddleware, getInstructorQuiz);
router.get("/quizId/:quizId", authMiddleware, getQuizById);
router.put("/edit/:quizId", authMiddleware, updateQuiz);
router.delete("/delete/:quizId", authMiddleware, deleteQuiz);
router.post("/submit/:quizId", authMiddleware, handleSubmitQuiz);
router.get("/results/:userId", authMiddleware, getUserResults);

export default router;
