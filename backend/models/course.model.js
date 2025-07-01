import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    thumbnail: String, // cloudinary url
    price: Number, // 0 = free
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    rating: Number,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    pdfs: [{ filename: String, url: { type: String } }],
    isPublished: Boolean,
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model("Course", courseSchema);

// Stores info about each course.