import { useApp } from "../context/AppContextProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function QuizResult() {
  const [previousResults, setPreviousResults] = useState([]);
  const { user, baseUrl } = useApp();
  const [loading, setLoading] = useState(true);

  const userId = user?._id;
  const location = useLocation();

  // current submitted quiz result
  const freshResult = location.state?.freshResult;

  const getQuizResults = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/quiz/results/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setPreviousResults(res.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuizResults();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="mt-24 mb-20 max-w-7xl mx-auto px-4 lg:px-10">
      <div className="flex flex-col items-center gap-6">
        {freshResult && (
          <div className="flex justify-center items-center flex-col w-[400px] mb-6 p-6 bg-green-50 border border-green-200 rounded-2xl shadow">
            <h2 className="text-2xl font-bold text-green-700">🎉 Congrats!</h2>
            <p className="text-lg text-gray-700 mt-2">
              You scored{" "}
              <span className="font-semibold text-green-800">
                {freshResult.score}/{freshResult.total}
              </span>
            </p>
          </div>
        )}

        {/* previous results history */}
        <div className="bg-white shadow rounded-lg overflow-hidden w-full max-w-2xl">
          <h3 className="text-xl font-semibold p-4">Previous Quizzes Result</h3>
          {previousResults.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-black">
                  <th className="p-3 border-b">Score</th>
                  <th className="p-3 border-b">Quiz Title</th>
                  <th className="p-3 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {previousResults.map((result, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 border-b">
                      {result.score}/{result.total}
                    </td>
                    <td className="p-3 border-b">{result.quizId.title}</td>
                    <td className="p-3 border-b">
                      {new Date(result.takenAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-4 text-gray-500">No previous results available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizResult;
