import { Course } from "../models/course.model.js";
import { Quiz } from "../models/quiz.model.js";
import { QuizResult } from "../models/quizResult.model.js";

// add the quiz for course
const addQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId); // from courses data

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the course instructor can add quiz" });
    }

    const alreadyAdded = await Quiz.findOne({ title });

    if (alreadyAdded) {
      res.status(400).json({ message: "Quiz already exists" });
    }

    const quiz = new Quiz({
      courseId,
      title,
      questions,
    });

    await quiz.save();

    res.status(201).json({ quiz, message: "Quiz added successfully ...!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add quiz", error: error.message });
  }
};

// get the quiz
const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ courseId: req.params.courseId }).select(
      "-questions.correctAnswer"
    );

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch quiz", error: error.message });
  }
};

// get the quiz - with courseId for instructor
const getInstructorQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ courseId: req.params.courseId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch quiz", error: error.message });
  }
};

// get quiz by quizId
const getQuizById = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch quiz", error: error.message });
  }
};

// update quiz
const updateQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const course = await Course.findById(quiz.courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this quiz" });
    }

    const { title, questions } = req.body; // updated data
    const updatedFields = { title, questions };

    const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, updatedFields, {
      new: true,
    });

    res.status(200).json({ updatedQuiz, message: "Quiz updated..." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update quiz", error: error.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const course = await Course.findById(quiz.courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this quiz" });
    }

    await Quiz.findByIdAndDelete(quizId); // delete quiz

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete quiz",
      error: error.message,
    });
  }
};

// submit quiz
const handleSubmitQuiz = async (req, res) => {
  try {
    const { answers } = req.body || []; // array of selected options indexes

    const quizId = req.params.quizId;
    const userId = req.user.id;

    const quiz = await Quiz.findById(quizId);

    let score = 0;
    quiz.questions.forEach((que, index) => {
      if (answers[index] === que.correctAnswer) score++; // match the index
    });

    // store
    const result = new QuizResult({
      userId,
      quizId,
      score,
      total: quiz.questions.length,
      answers,
    });

    await result.save();

    res.json({ score, total: quiz.questions.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all quiz results for a user
const getUserResults = async (req, res) => {
  try {
    const userId = req.user.id;

    const results = await QuizResult.find({ userId })
      .populate("quizId", "title")
      .sort({ takenAt: -1 }); // latest

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  addQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  handleSubmitQuiz,
  getUserResults,
  getInstructorQuiz,
  getQuizById,
};
