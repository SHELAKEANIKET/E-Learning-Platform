import mongoose from "mongoose";

const discussionMessagesSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String, // text messages
  },
  {
    timestamps: true,
  }
);

export const DiscussionMessage = mongoose.model(
  "DiscussionMessage",
  discussionMessagesSchema
);
