import { Review } from "../models/review.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      course: courseId,
      user: userId,
    });
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this course" });
    }

    const review = new Review({
      course: courseId,
      user: userId,
      rating,
      comment,
    });

    const savedReview = await review.save();

    // add course to instructor's createdCourses
    // Push review to course's review array
    course.reviews.push(savedReview._id);
    await course.save();

    res
      .status(201)
      .json({ review: savedReview, message: "Review added successfully ...!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add review", error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    const courseId = req.param.courseId;
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    const { rating, comment } = req.body;

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();

    res
      .status(200)
      .json({ review: updatedReview, message: "Review updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update review", error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const courseId = req.param.courseId;
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: "Course not found" });

    if (review.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();

    // Remove review from course's review array
    course.reviews = course.reviews.filter(
      (id) => id.toString() !== review._id.toString()
    );
    await course.save();
    
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete review", error: error.message });
  }
};

export { addReview, updateReview, deleteReview };
