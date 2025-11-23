import { DiscussionMessage } from "../models/discussionMessages.model.js";

const getDiscussionMessages = async (req, res) => {
  try {
    const messages = await DiscussionMessage.find({
      courseId: req.params.courseId,
    })
      .populate("userId", "name")
      .sort({ createdAt: 1 }); // oldest first
    res
      .status(200)
      .json({ messages, message: "Messages fetched successfully...!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch messages", error: error.message });
  }
};

export { getDiscussionMessages };
