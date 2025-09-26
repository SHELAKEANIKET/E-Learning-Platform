import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express from "express";
import connectDB from "./db/connection.js";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import courseRoute from "./routes/courseRoute.js";
import lessonRoute from "./routes/lessonRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import enrollmentRoute from "./routes/enrollmentRoutes.js";
import authRoute from "./routes/authRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import quizRoute from "./routes/quizRoute.js"

dotenv.config();

const app = express();
const PORT = 9000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://eduhub-elearning.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
//! testing
app.get("/", (req, res) => {
  res.json({ message: "backend is working fine..." });
});

app.use("/api/user", userRoute);
app.use("/api/course", courseRoute);
app.use("/api/lesson", lessonRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/enrollment", enrollmentRoute);
app.use("/api/auth", authRoute);
app.use("/api/review", reviewRoute);
app.use("/api/quiz", quizRoute);

// db connection
connectDB();

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
