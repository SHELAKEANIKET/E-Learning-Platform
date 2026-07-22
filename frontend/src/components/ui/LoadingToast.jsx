import React, { useEffect, useState } from "react";

const LoadingToast = ({ isLoading, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      setTimeout(() => onComplete && onComplete(), 500);
      return;
    }
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 95) return prev + 1; // Simulate progress up to 95%
        return prev;
      });
    }, 500); // Adjust speed as needed
    return () => clearInterval(interval);
  }, [isLoading, onComplete]);

  return isLoading ? (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded px-6 py-4 z-50 flex flex-col items-center">
      <span className="mb-2 text-gray-700 font-semibold">
        Server is loading... Please wait
      </span>
      <div className="w-48 bg-gray-200 rounded-full h-3 mb-2">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm text-textColor">{progress}%</span>
    </div>
  ) : null;
};

export default LoadingToast;
