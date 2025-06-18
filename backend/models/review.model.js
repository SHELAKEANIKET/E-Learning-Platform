import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // course id
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user id
    rating: Number,
    comment: String,
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.model("Review", reviewSchema);

// Stores user reviews for a course.