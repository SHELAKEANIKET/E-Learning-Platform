import { useApp } from "../context/AppContextProvider";
import axios from "axios";
import { PlayCircle } from "lucide-react";
import starIcon from "/assets/star.png";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { showToast } from "../helper/toastMessage.js";
import parse from "html-react-parser";
import { load } from "@cashfreepayments/cashfree-js";
import CircularProgressbar from "../components/ui/CircularPrograssbar";
import Reviews from "../components/ui/Reviews";

function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [enrollment, setEnrollment] = useState(null);

  const { baseUrl, user } = useApp();
  const navigate = useNavigate();

  // get the course by id
  const getCourseByID = async (req, res) => {
    const result = await axios.get(`${baseUrl}/course/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    setCourse(result.data);
  };

  const courseId = course?._id;

  useEffect(() => {
    getCourseByID();
  }, [id]);

  // check if user is enrolled in course or not
  const isEnrolled = course?.studentsEnrolled?.some(
    (student) => student._id.toString() === user?._id.toString()
  );

  const handleLessonClick = async (lesson) => {
    if (user === null || isEnrolled === false) {
      showToast("Access denied. Not enrolled", "error");
      return;
    }
    setSelectedLesson(lesson);
  };

  // payment integration
  let cashfree;
  let insitialzeSDK = async function () {
    cashfree = await load({
      mode: "sandbox",
    });
  };

  insitialzeSDK();

  const getSessionId = async () => {
    try {
      const coursePrice = course?.price;

      if (!coursePrice) {
        console.log("Course price is not available yet.");
        return;
      }

      let res = await axios.post(
        `${baseUrl}/payment/checkout`,
        { courseId, coursePrice },
        {
          withCredentials: true,
        }
      );

      if (res.data && res.data.payment_session_id) {
        // console.log(res.data);
        setOrderId(res.data.order_id);
        return res.data.payment_session_id;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // enroll student logic
  const handleEnroll = async () => {
    if (user == null) {
      navigate("/login");
      return;
    }

    if (user?.role === "instructor") {
      showToast("Only students can enroll in course", "error");
      return;
    }

    try {
      let sessionId = await getSessionId();

      let checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_self",
      };

      cashfree.checkout(checkoutOptions).then((res) => {
        console.log("payment initialized");
      });
    } catch (error) {
      console.log("Enrollment error:", error);
      showToast("Failed to initiate payment.", "error");
    }
  };

  // fetch enrollment data
  const fetchEnrollment = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/enrollment/getenrollment/${courseId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setEnrollment(res.data.enrollment);
    } catch (err) {
      console.error("Failed to fetch enrollment:", err);
    }
  };

  useEffect(() => {
    fetchEnrollment(); // refresh UI state
  }, [courseId]);

  // mark as complete
  const markProgress = async (lessonId) => {
    try {
      await axios.post(
        `${baseUrl}/enrollment/progress`,
        { courseId, lessonId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      showToast("Marked as complete", "success");
    } catch (err) {
      console.log(err);
      showToast("Error updating progress", "error");
    }
  };

  // calculate progress
  const calculateProgress = () => {
    const totalLessons = course?.lessons?.length || 0;
    const completed =
      enrollment?.progress?.filter((item) => item.completed).length || 0;

    if (totalLessons === 0) return 0;

    return Math.floor((completed / totalLessons) * 100); // percentage
  };

  // loading animation
  if (course == null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader" />
      </div>
    );
  }

  return (
    <>
      <div className="mt-16 max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Side Content */}
        <div className="px-4">
          <div className="relative">
            {!imageLoaded && (
              <div className="w-full h-64 bg-gray-300 animate-pulse rounded-xl mb-6" />
            )}
            <img
              src={course?.thumbnail}
              alt="Course Cover"
              className="rounded-xl w-full h-auto object-cover mb-6 text-white shadow"
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute bg-formBackground backdrop-blur-lg rounded-full top-2 right-2 py-1 px-2.5 lg:px-1.5">
              <div className="lg:px-2 flex justify-start items-center gap-1">
                <img src={starIcon} alt="rating icon" className="w-4 h-4" />
                <span className="font-medium text-white">4.5</span>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white">
            {course?.title}
          </h2>
          <div className="flex flex-wrap flex-shrink-0 justify-center items-start sm:justify-start sm:items-center flex-col sm:flex-row gap-2 md:gap-5 my-4">
            {isEnrolled === false && (
              <button
                onClick={handleEnroll}
                className="bg-gradient-to-r from-gradient-start to-gradient-end text-white px-4 py-2 font-semibold rounded-md text-lg cursor-pointer"
              >
                Enroll Now
              </button>
            )}
            <p className="font-semibold text-2xl text-white">
              ₹{course?.price} {""}
              <s className="text-base">₹{course?.price + 250}</s>
            </p>
            <h2 className="font-medium text-lg text-white">
              Instructor: {course?.instructor?.name}
            </h2>
          </div>
          <div className="text-white prose">
            {typeof course?.description === "string" ? (
              <div className="prose prose-invert max-w-none text-white text-base">
                {parse(course?.description)}
              </div>
            ) : (
              <p className="text-gray-400 italic">No description available.</p>
            )}
          </div>
          {/* Review Section */}
          <div>
            <Reviews course={course} isEnrolled={isEnrolled} />
          </div>
        </div>
        {/* Right Side Content */}
        <div className="bg-formBackground p-4 h-fit">
          <h3 className="text-2xl font-semibold mb-4 text-white">
            📚 Course Content
          </h3>
          <div className="rounded-2xl shadow-md border-2 border-borderColor overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 bg-white/95 px-4 py-2">
              Lessons
            </h2>
            {course.lessons.length > 0 ? (
              <ul className="space-y-3 p-4">
                {course?.lessons?.map((lesson, index) => {
                  const isCompleted = enrollment?.progress?.some(
                    (item) =>
                      item.lessonId === lesson._id && item.completed == true
                  );
                  return (
                    <div
                      className="flex justify-between items-center flex-wrap gap-2"
                      key={lesson._id}
                    >
                      <li
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border-[1.5px] border-borderColor hover:bg-white hover:text-black transition ${
                          selectedLesson?._id === lesson._id
                            ? "bg-white/80 text-black"
                            : "text-white"
                        } ${isEnrolled ? "w-full lg:w-[70%]" : "w-full"}`}
                        onClick={() => handleLessonClick(lesson)}
                      >
                        <span className="font-medium">
                          {index + 1}. {lesson.title}
                        </span>
                        <PlayCircle className="text-[#1cb49b]" size={20} />
                      </li>
                      {isEnrolled && (
                        <button
                          disabled={isCompleted}
                          onClick={() => markProgress(lesson._id)}
                          className={`px-3 py-2 rounded text-sm ${
                            isCompleted
                              ? "bg-primary text-white cursor-not-allowed"
                              : "bg-primary text-white"
                          }`}
                        >
                          {isCompleted ? "Completed" : "Mark as Complete"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </ul>
            ) : (
              <p className="p-4 text-white">No Lessons Added</p>
            )}
          </div>
          <div className="lg:col-span-2 p-4 my-2">
            {user !== null && selectedLesson ? (
              <>
                <h3 className="text-2xl font-semibold mb-2 text-gray-100">
                  {selectedLesson.title}
                </h3>
                <video
                  src={selectedLesson.videoUrl}
                  controls
                  className="rounded-xl w-full mb-4"
                />
                <div className="text-white prose">
                  {typeof selectedLesson.content === "string" ? (
                    <div className="prose prose-invert max-w-none text-white text-lg">
                      {parse(selectedLesson.content)}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-wrap justify-start lg:items-start items-center gap-2">
            <div className="">
              {isEnrolled && (
                <div className="flex justify-center items-center m-4 w-full lg:w-fit py-4 px-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600">
                  <CircularProgressbar progress={calculateProgress()} />
                </div>
              )}
            </div>
            <div className="">
              {isEnrolled && (
                <div className="m-4">
                  {course?.pdfs?.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        📄 PDF Notes
                      </h2>
                      <ul>
                        {course.pdfs.map((pdf, idx) => (
                          <li
                            key={idx}
                            className="my-4 py-1 px-2 rounded bg-primary"
                          >
                            <a
                              href={pdf.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white font-medium"
                            >
                              {idx + 1}
                              {". "}
                              {pdf.filename}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetails;
