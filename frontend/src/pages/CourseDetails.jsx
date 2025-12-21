import { useApp } from "../context/AppContextProvider";
import axios from "axios";
import { PlayCircle } from "lucide-react";
import starIcon from "/assets/star.png";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  const [modalOpen, setModalOpen] = useState(false);

  const { baseUrl, user } = useApp();
  const navigate = useNavigate();

  // get the course by id
  const getCourseByID = async () => {
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
    (student) => student?._id?.toString() === user?._id?.toString()
  );

  const isInstructor = course?.instructor?.name === user?.name;

  const handleLessonClick = async (lesson) => {
    if (user === null || isEnrolled === false) {
      showToast("Access denied. Not enrolled", "error");
      return;
    }
    setSelectedLesson(lesson);
    setModalOpen(true);
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
    if (courseId) {
      fetchEnrollment();
    } // refresh UI state
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

  function VideoModal({ open, onClose, lesson }) {
    if (!open || !lesson) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-neutral-900 rounded-xl p-6 max-w-2xl w-full relative">
          <button
            className="absolute top-2 right-2 text-white text-2xl"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4 text-white">{lesson.title}</h2>
          <video
            src={lesson.videoUrl}
            controls
            className="w-full rounded-xl mb-4 shadow-md"
          />
          <div className="text-white prose prose-invert max-w-none text-lg">
            {typeof lesson.content === "string" ? parse(lesson.content) : null}
          </div>
        </div>
      </div>
    );
  }

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
          <div className="text-white prose text-justify lg:text-left">
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
        <div className="bg-neutral-800 p-6 rounded-xl shadow-lg h-fit">
          <h3 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
            📚 Course Content
          </h3>
          <div className="bg-neutral-700 rounded-xl overflow-hidden shadow-md">
            <h2 className="text-xl font-medium bg-neutral-600 px-6 py-4 text-white">
              Lessons ({course?.lessons?.length || 0})
            </h2>
            {course.lessons.length > 0 ? (
              <ul className="divide-y divide-neutral-600">
                {course?.lessons?.map((lesson, index) => {
                  const isCompleted = enrollment?.progress?.some(
                    (item) =>
                      item.lessonId === lesson._id && item.completed == true
                  );
                  return (
                    <li
                      key={lesson._id}
                      className={`p-4 hover:bg-neutral-600 transition-colors ${
                        selectedLesson?._id === lesson._id ? "bg-neutral-500" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="flex items-center gap-3 cursor-pointer flex-1"
                          onClick={() => handleLessonClick(lesson)}
                        >
                          <PlayCircle className="text-primary w-5 h-5" />
                          <span className="font-medium text-white">
                            {index + 1}. {lesson.title}
                          </span>
                        </div>
                        {isEnrolled && (
                          <button
                            disabled={isCompleted}
                            onClick={(e) => {
                              e.stopPropagation();
                              markProgress(lesson._id);
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isCompleted
                                ? "bg-primary text-white cursor-not-allowed"
                                : "bg-transparent border-2 hover:bg-primary text-white"
                            }`}
                          >
                            {isCompleted ? "✓ Completed" : "Mark Complete"}
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="p-6 text-gray-400">No Lessons Added</p>
            )}
          </div>

          {/* Progress and Actions */}
          {isEnrolled && (
            <div className="mt-6 space-y-4">
              <div className="bg-neutral-700 p-4 rounded-xl">
                <h4 className="text-lg font-semibold text-white mb-3">
                  Your Progress
                </h4>
                <div className="flex justify-center">
                  <CircularProgressbar progress={calculateProgress()} />
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-3 justify-center items-center">
                <Link
                  to={`/course/${courseId}/quiz`}
                  className="block w-full bg-gradient-to-r from-gradient-start to-gradient-end text-white py-3 px-4 rounded-lg font-medium text-center transition-colors"
                >
                  📝 Take Quiz
                </Link>
                {(isInstructor || isEnrolled) && (
                  <Link
                    to={`/discussion-messages/${courseId}`}
                    className="block w-full bg-gradient-to-r from-gradient-end to-gradient-start text-white py-3 px-4 rounded-lg font-medium text-center transition-colors"
                  >
                    💬 Course Discussion
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* PDFs */}
          {isEnrolled && course?.pdfs?.length > 0 && (
            <div className="mt-6 bg-neutral-700 p-4 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-3">
                📄 PDF Notes
              </h4>
              <ul className="space-y-2">
                {course.pdfs.map((pdf, idx) => (
                  <li key={idx} className="border p-3 rounded-lg">
                    <a
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-medium"
                    >
                      {idx + 1}. {pdf.filename} ⬇️
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <VideoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        lesson={selectedLesson}
      />
    </>
  );
}

export default CourseDetails;
