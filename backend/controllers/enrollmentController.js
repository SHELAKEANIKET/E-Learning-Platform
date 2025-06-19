import { Course } from "../models/course.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id; // from authMiddleware

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const alreadyEnrolled = course.enrolledStudents.includes(userId);
    if (alreadyEnrolled) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this course" });
    }

    // add enrolledStudents into course model
    course.enrolledStudents.push(userId);
    await course.save();

    // add course to user's enrolledCourses
    const user = await User.findById(userId);
    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({ message: "Enrollment successful", courseId });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ message: "Server error during enrollment" });
  }
};

const getMonthlyRevenue = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized: No user ID" });
    }

    const revenueData = await Enrollment.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      {
        $unwind: "$courseDetails",
      },
      {
        $match: {
          "courseDetails.instructor": new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $addFields: {
          createdDate: { $toDate: "$createdAt" }, // Ensure it's a proper Date object
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: {
            $sum: {
              $toDouble: "$paymentInfo.amountPaid", // Convert string to number
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Map months to labels
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const fullData = months.map((label, index) => {
      const monthData = revenueData?.find((item) => item._id === index + 1);
      return {
        label,
        revenue: monthData ? monthData.totalRevenue : 0,
      };
    });
    res.status(200).json(fullData);
  } catch (err) {
    console.error("Error getting revenue data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const markProgress = async (req, res) => {
  const { courseId, lessonId } = req.body;
  const userId = req.user.id;

  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });

  if (!enrollment) return res.status(404).json({ message: "Not Enrolled" });

  const lessonProgress = enrollment.progress.find(
    (item) => item.lessonId.toString() === lessonId
  );

  if (lessonProgress) {
    lessonProgress.completed = true;
  } else {
    enrollment.progress.push({ lessonId, completed: true });
  }

  await enrollment.save();
  res.status(200).json({
    message: "Lesson progress updated",
    progress: enrollment.progress, // pass the progress array
  });
};

const getEnrollmentByCourseId = async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.user.id;

  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });

  if (!enrollment) return res.status(404).json({ message: "Not Enrolled" });

  res.status(200).json({
    message: "Lesson progress updated",
    enrollment,
  });
};

export {
  enrollInCourse,
  getMonthlyRevenue,
  markProgress,
  getEnrollmentByCourseId,
};
