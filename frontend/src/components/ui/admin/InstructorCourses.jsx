import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useApp } from "../../../context/AppContextProvider";
import { showToast } from "../../../helper/toastMessage.js";
import { useNavigate } from "react-router-dom";

const InstructorCourses = () => {
  const { instructorCourses, baseUrl, setCourses } = useApp();
  const navigate = useNavigate();

  const handleEditClick = async (course) => {
    navigate(`/instructor/course/edit/${course._id}`);
  };

  const handleDeleteClick = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`${baseUrl}/course/${courseId}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        setCourses((prevCourse) =>
          prevCourse.filter((course) => course._id !== courseId)
        );
        showToast("Course deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting Course:", error);
        showToast("Failed to delete the course", "error");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-20">
      {instructorCourses?.length > 0 ? (
        <>
          <div>
            <h1 className="text-xl font-semibold py-4 px-1 text-white">
              Your Courses
            </h1>
          </div>
          <div className="py-2">
            <div className="w-full overflow-x-auto block bg-formBackground">
              <table className="w-full min-w-[800px] border border-borderColor">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-base font-semibold text-black whitespace-nowrap">
                      Thumbnail
                    </th>
                    <th className="px-6 py-3 text-left text-base font-semibold text-black whitespace-nowrap">
                      Course Name
                    </th>
                    <th className="px-6 py-3 text-left text-base font-semibold text-black whitespace-nowrap">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-base font-semibold text-black whitespace-nowrap">
                      Total Enrolled
                    </th>
                    <th className="px-6 py-3 text-left text-base font-semibold text-black whitespace-nowrap">
                      Created On
                    </th>
                    <th className="px-6 py-3 text-left text-base font-semibold text-black whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {instructorCourses.map((course) => (
                    <tr
                      key={course._id}
                      className="border-b border-gray-600 text-white"
                    >
                      <td className="px-6 py-3 whitespace-nowrap">
                        <img
                          src={course.thumbnail}
                          alt={course.name}
                          className="w-28 h-auto rounded-md object-contain"
                        />
                      </td>
                      <td className="px-6 py-3 font-medium whitespace-nowrap">
                        {course.title}
                      </td>
                      <td className="px-6 py-3 font-medium whitespace-nowrap">
                        {course.price}
                      </td>
                      <td className="px-6 py-3 font-medium whitespace-nowrap">
                        {course.studentsEnrolled?.length}
                      </td>
                      <td className="px-6 py-3 font-medium whitespace-nowrap">
                        {course.createdAt?.slice(0, 10)}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <button
                            className="text-yellow-500 hover:text-yellow-600"
                            onClick={() => handleEditClick(course)}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteClick(course._id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-20 flex justify-center items-center text-lg text-white">
          You have not uploaded any course
        </p>
      )}
    </div>
  );
};

export default InstructorCourses;
