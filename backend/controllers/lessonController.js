import { Course } from "../models/course.model.js";
import { Lesson } from "../models/lesson.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addLesson = async (req, res) => {
  try {
    const { title, content } = req.body;
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId); // from courses data

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the course instructor can add lessons" });
    }

    const existedLesson = await Lesson.findOne({ title });

    if (existedLesson) {
      res.status(400).json({ message: "Lesson already exists" });
    }

    if (!req.files || !req.files.videoUrl[0]) {
      return res.status(400).json({ message: "File not uploaded" });
    }

    // image uploading logic
    const videoUrlPath = req.files?.videoUrl[0]?.path;

    if (!videoUrlPath) {
      throw new ApiError(400, "Video url path is required");
    }

    const lessonVideoUrl = await uploadOnCloudinary(videoUrlPath);

    // console.log("Cloudinary upload response: ", lessonVideoUrl);

    if (!lessonVideoUrl || !lessonVideoUrl.url) {
      res.status(400).json({ message: "lesson video url is required" });
    }

    // add into lesson collection
    const lesson = new Lesson({
      title,
      content,
      videoUrl: lessonVideoUrl.url, // string
      course: courseId,
    });

    const savedLesson = await lesson.save();

    // add into course collection
    course.lessons.push(savedLesson._id);
    await course.save();

    res
      .status(201)
      .json({ savedLesson, message: "lesson added successfully ...!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add lesson", error: error.message });
  }
};

// get lessons of perticular course
const getLessonsByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const lessons = await Lesson.find({ course: courseId });

    res.status(200).json(lessons);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch lessons", error: error.message });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json(lesson);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch lesson", error: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const courseId = lesson.course;
    const course = await Course.findById(courseId);

    if (course.instructor.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this lesson" });
    }

    const newLessonData = req.body;

    if (req.files && req.files.videoUrl && req.files.videoUrl[0]) {
      const lessonVideoUrlPath = req.files.videoUrl[0].path;

      if (!lessonVideoUrlPath) {
        return res.status(400).json({ message: "Video Url file path missing" });
      }

      const uploadedVideoUrl = await uploadOnCloudinary(lessonVideoUrlPath);

      if (!uploadedVideoUrl || !uploadedVideoUrl.url) {
        return res.status(400).json({ message: "Cloudinary upload failed for video url" });
      }

      // Add uploaded image URL to newLessonData
      newLessonData.videoUrl = uploadedVideoUrl.url;
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      newLessonData,
      {
        new: true,
      }
    );

    res.status(200).json({ updatedLesson, message: "Lesson updated..." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update lesson", error: error.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const course = await Course.findById(lesson.course); // course id

    if (course.instructor.toString() !== req.user.id) { // check for instructor
      return res
        .status(403)
        .json({ message: "Not authorized to delete this lesson" });
    }

    await lesson.deleteOne();

    // Remove lesson from course's lessons array
    course.lessons = course.lessons.filter(
      (id) => id.toString() !== lesson._id.toString()
    );
    await course.save();

    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete lesson", error: error.message });
  }
};

export {
  addLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
};
