import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../../context/AppContextProvider";
import React, { useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";

function CourseLessons() {
  const [openCourse, setOpenCourse] = useState(null);

  const { instructorCourses, baseUrl } = useApp();
  const navigate = useNavigate();

  const handleEditClick = (lesson) => {
    navigate(`/instructor/lesson/edit/${lesson._id}`);
  };

  const handleDeleteClick = async (lessonId) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await axios.delete(`${baseUrl}/lesson/${lessonId}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        showToast("Lesson deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting lesson:", error);
        showToast("Failed to delete the lesson", "error");
      }
    }
  };

  return (
    <div className="space-y-4 mx-2 lg:mx-20">
      {instructorCourses.length > 0 ? (
        <>
          <h2 className="text-white text-xl m">Course Lessons</h2>
          {instructorCourses?.map((course) => (
            <div
              key={course._id}
              className="border rounded-lg p-4 bg-white shadow"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">{course.title}</h2>
                <button
                  onClick={() =>
                    setOpenCourse(openCourse === course._id ? null : course._id)
                  }
                  className="text-sm text-blue-600"
                >
                  {openCourse === course._id ? "Hide" : "Show"}
                </button>
              </div>
              {openCourse === course._id && (
                <div className="mt-4">
                  {course.lessons.length > 0 ? (
                    <ul className="space-y-2">
                      {course.lessons?.map((lesson, index) => (
                        <li
                          key={lesson._id}
                          className="border p-2 rounded flex justify-between items-center"
                        >
                          <span className="font-medium">
                            {index + 1}. {lesson.title}
                          </span>
                          <div className="flex gap-2">
                            <button
                              className="text-yellow-500"
                              onClick={() => handleEditClick(lesson)}
                            >
                              <MdEdit className="size-5" />
                            </button>
                            <button
                              className="text-red-500"
                              onClick={() => handleDeleteClick(lesson._id)}
                            >
                              <MdDelete className="size-5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No lessons added yet.</p>
                  )}
                  <div className="my-3">
                    <Link
                      to={`/instructor/addlesson/${course._id}`}
                      className="bg-primary text-white px-2 py-1.5 rounded"
                    >
                      Add Lesson
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </>
      ) : (
        <p className="mt-20 flex justify-center items-center text-lg text-white">
          You have not uploaded any course
        </p>
      )}
    </div>
  );
}

export default CourseLessons;
