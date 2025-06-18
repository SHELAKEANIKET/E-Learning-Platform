import { Course } from "../models/course.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

const addCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;

    console.log("Title value:", title); // should be a string

    if (req.user.role !== "instructor") {
      return res
        .status(400)
        .json({ message: "Only instructors can add new course" });
    }

    const existedCourse = await Course.findOne({ title });

    if (existedCourse) {
      res.status(400).json({ message: "Course already exists" });
    }

    if (!req.files || !req.files.courseThumbnail[0]) {
      return res.status(400).json({ message: "File not uploaded" });
    }

    // image uploading logic
    const courseThumbnailPath = req.files?.courseThumbnail[0]?.path;

    if (!courseThumbnailPath) {
      throw new ApiError(400, "Course thumbnail path is required");
    }

    const courseThumbnail = await uploadOnCloudinary(courseThumbnailPath);

    // console.log("Cloudinary upload response: ", courseThumbnail);

    if (!courseThumbnail || !courseThumbnail.url) {
      res.status(400).json({ message: "Course Thumbnail is required" });
    }

    const newCourse = new Course({
      title,
      description,
      category,
      price,
      thumbnail: courseThumbnail.url, // string
      instructor: req.user.id, // taken from auth middleware
    });

    const savedCourse = await newCourse.save();

    // add course to instructor's createdCourses
    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdCourses: savedCourse._id },
    });

    res
      .status(201)
      .json({ savedCourse, message: "Course added successfully ...!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create course", error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .sort({createdAt: -1})
      .populate("instructor", "name email")
      .populate({ path: "studentsEnrolled", select: "name" })
      .populate({ path: "lessons", select: "title" });

    res
      .status(200)
      .json({ courses, message: "Courses fetched successfully.." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch courses", error: error.message });
  }
};

const getInstructorCourses = async (req, res) => {
  const instructorId = req.user.id;

  try {
    const courses = await Course.find({ instructor: instructorId })
      .populate("instructor", "name email")
      .populate({ path: "studentsEnrolled", select: "name" })
      .populate({ path: "lessons", select: "title" });
    res
      .status(200)
      .json({ courses, message: "Courses fetched successfully.." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch courses", error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("lessons")
      .populate("instructor", "name")
      .populate({ path: "studentsEnrolled", select: "name" });

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json(course);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch course", error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only the instructor who created it can update
    if (course.instructor.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this course" });
    }

    const updatedData = req.body;

    if (
      req.files &&
      req.files.courseThumbnail &&
      req.files.courseThumbnail[0]
    ) {
      const thumbnailPath = req.files.courseThumbnail[0].path;

      if (!thumbnailPath) {
        return res.status(400).json({ message: "Thumbnail file path missing" });
      }

      const uploadedThumbnail = await uploadOnCloudinary(thumbnailPath);

      if (!uploadedThumbnail || !uploadedThumbnail.url) {
        return res.status(400).json({ message: "Cloudinary upload failed" });
      }

      // Add uploaded image URL to updatedData
      updatedData.thumbnail = uploadedThumbnail.url;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updatedData,
      {
        new: true,
      }
    );

    res
      .status(200)
      .json({ updatedCourse, message: "Course updated successfully ...!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update course", error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this course" });
    }

    await course.deleteOne();

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete course", error: error.message });
  }
};

export {
  addCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
};
