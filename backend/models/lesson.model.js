import mongoose from "mongoose";

const lessonsSchema = new mongoose.Schema(
  {
    title: String,
    videoUrl: String, // cloudinary url
    content: String,
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    }, // lessons belonged to the course
  },
  {
    timestamps: true,
  }
);

export const Lesson = mongoose.model("Lesson", lessonsSchema);

// A lesson within a course (video, description, quiz, etc.).
