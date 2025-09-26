import { showToast } from "../helper/toastMessage.js";
import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const useApp = () => {
  return useContext(AppContext);
};

function AppContextProvider({ children }) {
  const baseUrl = "https://e-learning-platform-ht9m.onrender.com/api";
  const [courses, setCourses] = useState([]); // all courses
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [instructorCourses, setInstructorCourses] = useState([]); // only instructor courses
  const [loadingCourses, setLoadingCourses] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${baseUrl}/course/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setCourses(res.data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error.message);
    }
  };

  const fetchInstructorCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await axios.get(`${baseUrl}/course/instructor/courses`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setInstructorCourses(res.data.courses || []);
    } catch (error) {
      console.error("Error fetching courses:", error.message);
    } finally {
      setLoadingCourses(false);
    }
  };

  // authentication
  const checkAuth = async () => {
    setAuthLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/auth/check`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      console.log("Not authenticated");
    } finally {
      setAuthLoading(false);
    }
  };

  const signupUser = async (name, email, password, role) => {
    try {
      const res = await axios.post(
        `${baseUrl}/user/signup`,
        { name, email, password, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.status == 201) {
        showToast(res.data.message, "success");
      }
      setUser(res.data.user);
      return res;
    } catch (error) {
      console.error("Signup user error:", error.message);
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await axios.post(
        `${baseUrl}/user/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        showToast(res.data.message, "success");
      }
      setUser(res.data.user);
      return res;
    } catch (error) {
      console.error("Login user error:", error.message);
    }
  };

  const logout = async () => {
    try {
      const res = await axios.get(`${baseUrl}/user/logout`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        showToast(res.data.message, "success");
      }

      setUser(null);
    } catch (error) {
      console.error("Logout user error:", error.message);
    }
  };

  const addCourse = async ({
    title,
    description,
    category,
    price,
    courseThumbnail,
  }) => {
    try {
      const res = await axios.post(
        `${baseUrl}/course/add`,
        {
          title,
          description,
          category,
          price,
          courseThumbnail,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        showToast(res.data.message, "success");
      }

      return res;
    } catch (error) {
      console.error("Error while adding new course:", error.message);
    }
  };

  const addLessonInCourse = async ({ title, content, videoUrl }, id) => {
    try {
      const res = await axios.post(
        `${baseUrl}/lesson/add/${id}`,
        {
          title,
          content,
          videoUrl,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        showToast(res.data.message, "success");
      }

      return res;
    } catch (error) {
      console.error("Error while adding new lessons:", error.message);
    }
  };

  const getCourseById = async (id) => {
    try {
      const res = await axios.get(`${baseUrl}/course/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      return res;
    } catch (error) {
      console.error("Error while fetching the course:", error.message);
    }
  };

  const getLessonById = async (id) => {
    try {
      const res = await axios.get(`${baseUrl}/lesson/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      return res;
    } catch (error) {
      console.error("Error while fetching the lesson:", error.message);
    }
  };

  const getInstructorQuiz = async (id) => {
    try {
      const quiz = await axios.get(`${baseUrl}/quiz/instructor/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return quiz;
    } catch (error) {
      console.log("Error while fetching the quiz:", error.message);
    }
  };

  useEffect(() => {
    fetchCourses();
    checkAuth();
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchInstructorCourses();
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        baseUrl,
        courses,
        instructorCourses,
        signupUser,
        loginUser,
        user,
        logout,
        addCourse,
        setCourses,
        getCourseById,
        addLessonInCourse,
        getLessonById,
        authLoading,
        loadingCourses,
        getInstructorQuiz,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
