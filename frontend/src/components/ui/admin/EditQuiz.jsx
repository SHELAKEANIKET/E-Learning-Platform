import { showToast } from "../../../helper/toastMessage.js";
import { useApp } from "../../../context/AppContextProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditQuiz() {
  const [quiz, setQuiz] = useState({
    title: "",
    questions: [
      {
        question: "",
        options: [],
        correctAnswer: "",
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams(); // quiz id
  const { baseUrl } = useApp();
  const navigate = useNavigate();

  // change title
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuiz({ ...quiz, [name]: value });
  };

  // change the particular question
  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][name] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  // change the option of particular question
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  // add new option field
  const addOption = (qIndex) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options.push("");
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  // add new question field
  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        { question: "", options: [], correctAnswer: "" },
      ],
    });
  };

  // handle correct option
  const handleCorrectAnswer = (qIndex, oIndex) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].correctAnswer = oIndex; // store index
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  // get the quiz by id
  const getQuiz = async () => {
    try {
      const quiz = await axios.get(`${baseUrl}/quiz/quizId/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setQuiz({
        title: quiz.data.title,
        questions: quiz.data.questions,
      });
    } catch (error) {
      console.log("Error while fetching the quiz:", error.message);
    }
  };

  useEffect(() => {
    getQuiz();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    for (const q of quiz.questions) {
      if (q.options.length === 0) {
        alert("Each question must have at least one option");
        setIsLoading(false);
        return;
      }
      const answerIndex = Number(q.correctAnswer); // convert to number
      if (
        isNaN(answerIndex) ||
        answerIndex < 0 ||
        answerIndex >= q.options.length
      ) {
        alert("Correct answer index is invalid for a question");
        setIsLoading(false);
        return;
      }
    }

    const form = new FormData();

    // Append form fields to FormData
    Object.keys(quiz).forEach((key) => {
      form.append(key, quiz[key]);
    });

    try {
      const res = await axios.put(
        `${baseUrl}/quiz/edit/${id}`,
        quiz, // quiz
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.status === 200 || res.status === 201) {
        showToast(res.data.message, "success");
        navigate("/instructor/courses");

        setQuiz({
          title: "",
          questions: [
            {
              question: "",
              options: [],
              correctAnswer: "",
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error while adding quiz:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full p-2 md:p-8 rounded-lg max-w-xl bg-formBackground"
      >
        <p className="text-xl text-white text-center font-semibold">
          Update Quiz
        </p>
        <div className="mt-4">
          <label className="block text-white text-sm font-semibold mb-2">
            Quiz Title
          </label>
          <input
            className="bg-transparent text-white focus:outline-none focus:shadow-outline border rounded py-2 px-2 block w-full"
            name="title"
            value={quiz.title}
            onChange={handleChange}
            type="text"
            required
          />
        </div>
        <div className="mt-4">
          {quiz.questions.map((q, qIndex) => (
            <div key={qIndex} className="mt-6 p-3 border rounded-md">
              <label className="text-white text-sm font-semibold">
                Question {qIndex + 1}
              </label>
              <input
                type="text"
                name="question"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                className="bg-transparent text-white border rounded py-2 px-2 w-full mt-2"
              />

              <p className="text-white mt-2">Options:</p>
              {q.options.map((option, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                  className="bg-transparent text-white border rounded py-2 px-2 w-full mt-1"
                />
              ))}
              <button
                type="button"
                onClick={() => addOption(qIndex)}
                className="mt-2 bg-primary text-white px-3 py-1 rounded"
              >
                Add Option
              </button>

              <div className="mt-3">
                {q.options.map((opt, oIndex) => (
                  <label key={oIndex} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={q.correctAnswer === oIndex}
                      onChange={() => handleCorrectAnswer(qIndex, oIndex)}
                    />
                    <span className="text-white">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="mt-4 bg-[#5591F1] text-white px-3 py-2 rounded"
          >
            Add Question
          </button>
        </div>
        <div className="mt-8">
          <button
            disabled={isLoading}
            className="bg-gradient-to-r from-gradient-start to-gradient-end text-white font-semibold py-3 px-2 w-full rounded-md cursor-pointer flex justify-center items-center text-center"
          >
            {isLoading ? (
              <div className="border-formBackground h-5 w-5 animate-spin rounded-full border-[3px] border-t-cyan-600" />
            ) : (
              "Update Quiz"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditQuiz;
