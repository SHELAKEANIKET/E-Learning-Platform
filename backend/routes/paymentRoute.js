import express from "express";
import { checkout, verifyPayment } from "../controllers/paymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/checkout", authMiddleware, checkout);
router.post("/verify", authMiddleware, verifyPayment);

export default router;
