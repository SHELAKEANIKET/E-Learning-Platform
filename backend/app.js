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
import quizRoute from "./routes/quizRoute.js";
import discussionMessagesRoute from "./routes/discussionMessages.js";
import { createServer } from "node:http"; // inbuilt module
import { Server } from "socket.io";
import { DiscussionMessage } from "./models/discussionMessages.model.js";

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = 9000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://eduhub-elearning.vercel.app",
    // origin: true, // change the url
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: true, // change the url
    methods: ["GET", "POST"],
    credentials: true,
  },
});

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
app.use("/api/discussion-messages", discussionMessagesRoute);

// db connection
connectDB();

// socket.io connection events
io.on("connection", (socket) => {
  console.log("A user connected!", socket.id);

  // handle user join in the group
  socket.on("join_room", async (userName, courseId) => {
    await socket.join(courseId); // particular course room

    console.log(`User joined course room: ${courseId}`);

    //! todo - emit the event
    socket.to(courseId).emit("join_room", `${userName} joined the group`);
  });

  //? handle receive and broadcast the message
  socket.on("sendMessage", async (data) => {
    const { courseId, userId, message } = data;

    // 1️⃣ Broadcast instantly to everyone (including sender)
    // io.in(courseId).emit("newMessage", {
    //   ...data,
    //   temp: false,
    //   createdAt: new Date().toISOString(),
    // });

    socket
      .to(courseId)
      .emit("newMessage", {
        ...data,
        temp: false,
        createdAt: new Date().toISOString(),
      });

    //* save message to db
    try {
      const savedMsg = await DiscussionMessage.create({
        courseId,
        userId,
        message,
      });

      // update sender with real saved data (id, createdAt)
      socket.emit("messageConfirmed", savedMsg);
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  });

  //? handle typing...
  socket.on("typing", async (userName, courseId) => {
    // broadcase the 'typing...' to all the users
    socket.to(courseId).emit("typing", userName); // sending the username
  });

  //? handle stop typing...
  socket.on("stopTyping", async (userName, courseId) => {
    // broadcase the 'typing...' to all the users
    socket.to(courseId).emit("stopTyping", userName); // sending the username
  });
});

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
