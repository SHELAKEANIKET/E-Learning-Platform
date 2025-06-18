import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // user enrolled in courses (students)
    createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // courses created by user (instructor)
    isVerified: Boolean,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);

//Handles authentication and user data (student, instructor, admin).