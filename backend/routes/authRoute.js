import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/check", authMiddleware, (req, res) => {
  res.status(200).json({
    authenticated: true,
    user: req.user,
  });
});

export default router;
