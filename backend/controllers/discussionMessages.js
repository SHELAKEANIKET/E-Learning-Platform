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

// add reaction to message
const addReaction = async (req, res) => {
  try {
    const { emoji } = req.body;
    const { messageId } = req.params; // single message
    const userId = req.user?._id;

    if (!userId || !emoji) {
      return res.status(400).json({ message: "emoji is required" });
    }

    const message = await DiscussionMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const existingReactionIndex = message.reactions.findIndex(
      (reaction) => reaction.userId.toString() === userId.toString()
    );

    // user not reacted yet
    if (existingReactionIndex === -1) {
      message.reactions.push({ userId, emoji });
    }

    // if same emoji -> remove it
    else if (message.reactions[existingReactionIndex].emoji === emoji) {
      message.reactions.splice(existingReactionIndex, 1); // remove that reaction
    }

    // new/different emoji -> update it
    else {
      message.reactions[existingReactionIndex].emoji = emoji;
    }

    await message.save();
    req.app.locals.io
      ?.to(message.courseId.toString())
      .emit("reactionUpdated", {
        messageId: message._id,
        reactions: message.reactions,
      });

    res.status(200).json({
      message: "Reaction updated successfully",
      reactions: message.reactions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add reaction", error: error.message });
  }
};

export { getDiscussionMessages, addReaction };
