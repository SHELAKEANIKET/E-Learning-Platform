import { useEffect, useState } from "react";

const testStudents = [
  { email: "student1@test.com", password: "test123" },
  { email: "student2@test.com", password: "test456" },
];

const testInstructors = [
  { email: "instructor1@test.com", password: "test123" },
  { email: "instructor2@test.com", password: "test456" },
];

const RotatingTestCredentials = () => {
  const [role, setRole] = useState(
    () => sessionStorage.getItem("role") || "student"
  );
  const [index, setIndex] = useState(() => {
    const savedIndex = sessionStorage.getItem("testCredIndex");
    if (savedIndex !== null) return parseInt(savedIndex);
    const random = Math.floor(Math.random() * 2); // length of your array
    sessionStorage.setItem("testCredIndex", random);
    return random;
  });

  const accounts = role === "student" ? testStudents : testInstructors;
  const current = accounts[index];

  useEffect(() => {
    sessionStorage.setItem("role", role);
    const newIndex = Math.floor(Math.random() * accounts.length);
    setIndex(newIndex);
    sessionStorage.setItem("testCredIndex", newIndex);
  }, []);

  return (
    <div className="p-4 border rounded bg-gray-50 flex justify-center items-center flex-col">
      <p className="mb-1 font-medium">🔒Test Credentials</p>
      <div className="mb-2">
        <button
          onClick={() => setRole("student")}
          className={`px-3 py-1 rounded mr-2 ${
            role === "student" ? "bg-primary text-white" : "bg-gray-200 border"
          }`}
        >
          Student
        </button>
        <button
          onClick={() => setRole("instructor")}
          className={`px-3 py-1 rounded ${
            role === "instructor"
              ? "bg-primary text-white"
              : "bg-gray-200 border"
          }`}
        >
          Instructor
        </button>
      </div>

      <div className="flex justify-center items-center gap-2">
        <p>{current.email}</p>
        <span>|</span>
        <p>{current.password}</p>
      </div>
    </div>
  );
};

export default RotatingTestCredentials;
