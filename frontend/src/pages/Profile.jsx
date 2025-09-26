import { useApp } from "../context/AppContextProvider";
import React, { useEffect, useState } from "react";
import profile from "/assets/profile.jpg";
import axios from "axios";

function Profile() {
  const { user, baseUrl } = useApp();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user?._id;

  const getUserDataById = async (userId) => {
    try {
      setLoading(true);
      const userData = await axios.get(
        `${baseUrl}/user/getuser?userId=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const courses = userData.data.user.enrolledCourses.map(
        (course) => course.title
      );
      setEnrolledCourses(courses);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getUserDataById(userId);
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 my-20">
      <div className="grid grid-cols-1 md:grid-cols-2 place-items-start gap-4 ">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg shadow-blue-600/30 p-8 flex flex-col items-center mb-10 w-3/4 mx-auto">
          <img
            src={profile}
            alt="User Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 shadow-md mb-4"
          />
          <h2 className="text-3xl font-bold text-white">{user?.name}</h2>
          <p className="text-white">{user?.email}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 border w-full">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            📚 Enrolled Courses
          </h3>
          {enrolledCourses?.length > 0 ? (
            <ul className="space-y-4">
              {enrolledCourses.map((course, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-100 hover:bg-gray-100 rounded-xl shadow-sm transition flex items-center gap-3"
                >
                  <span className="text-lg font-medium text-black">
                    🚀 {course}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No courses enrolled yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
