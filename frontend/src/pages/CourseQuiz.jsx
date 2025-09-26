import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContextProvider";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Swal from "sweetalert2";

const CourseQuiz = () => {
  const { baseUrl } = useApp();
  const [quiz, setQuiz] = useState([]);
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const quizId = quiz?._id;
  const navigate = useNavigate();

  const questions = quiz?.questions;
  const [selectedOptions, setSelectedOptions] = useState(
    Array(questions?.length).fill(null)
  );

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // handle submit quiz
  const handleSubmit = async () => {
    const result = await Swal.fire({
      title: "Submit Quiz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, submit",
    });

    if (!result.isConfirmed) return;

    try {
      const result = await axios.post(
        `${baseUrl}/quiz/submit/${quizId}`,
        { answers: selectedOptions },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      quizResult = result.data;
      navigate(`/quiz/result/${quizId}`, {
        state: { freshResult: result.data },
      });
      setSelectedOptions(null); // unselect the selected options
    } catch (error) {
      console.log(error.message);
    }
  };

  // handle option select
  const handleSelect = (questionIndex, optionIndex) => {
    const updated = [...selectedOptions];
    updated[questionIndex] = optionIndex; // keep the choice
    setSelectedOptions(updated);
  };

  const getQuiz = async () => {
    try {
      const quiz = await axios.get(`${baseUrl}/quiz/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setQuiz(quiz.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getQuiz();
  }, [id]);

  return (
    <div className="mt-24 text-white mx-3">
      <div className="flex items-center justify-center flex-col gap-5">
        <div className="w-full px-1 lg:px-4">
          <Link
            to={`/quiz/result/${quizId}`}
            className="text-white bg-primary rounded text-lg font-medium px-3 py-1"
          >
            My Quiz Results
          </Link>
        </div>
        <div>
          {quiz && questions?.length > 0 ? (
            <div className="bg-neutral-800 text-white p-8 rounded-2xl shadow-lg w-full max-w-md">
              <div className="mb-4 text-white text-center text-xl font-semibold">
                {quiz.title}
              </div>
              <div className="mb-4 text-gray-300">
                Question {currentQuestion + 1}/{questions?.length}
              </div>
              <h2 className="text-lg md:text-xl font-medium mb-6">
                {questions[currentQuestion].question}
              </h2>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(currentQuestion, index)}
                    className={`block w-full text-left px-4 py-2 rounded-lg 
                    ${
                      selectedOptions[currentQuestion] === index
                        ? "bg-primary text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrev}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 bg-primary rounded-lg disabled:opacity-50 hover:bg-primary"
                >
                  <IoIosArrowBack className="size-5" />
                </button>
                {currentQuestion === questions?.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 font-medium bg-primary rounded-lg disabled:opacity-50 hover:bg-primary"
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={currentQuestion === questions?.length - 1}
                    className="px-4 py-2 bg-primary rounded-lg disabled:opacity-50 hover:bg-primary"
                  >
                    <IoIosArrowForward className="size-5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            "Loding..."
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseQuiz;
