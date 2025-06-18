import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContextProvider";

const CourseEnroll = ({ courseId, user }) => {
  const navigate = useNavigate();
const {baseUrl} = useApp()



  return (
    <button
      onClick={handleEnroll}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Enroll Now
    </button>
  );
};

export default CourseEnroll;