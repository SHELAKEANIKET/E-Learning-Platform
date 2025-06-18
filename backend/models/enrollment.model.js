import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // user id
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    }, // course id
    paymentInfo: {
      orderId: String,
      paymentId: String,
      amountPaid: String,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    isCompleted: { // check if enrollment is completed or not
      type: Boolean,
      default: false,
    },
    progress: [
      {
        lessonId: {
          type: mongoose.Schema.Types.ObjectId, // lesson id
          ref: "Lesson",
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
