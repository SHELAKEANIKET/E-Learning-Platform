import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();
import {
  signupUser,
  loginUser,
  logoutUser,
  updateUser,
  getUserById,
} from "../controllers/userController.js";

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.put("/:id", authMiddleware, updateUser);
router.get("/getuser", authMiddleware, getUserById);
router.get("/logout", logoutUser);

export default router;
