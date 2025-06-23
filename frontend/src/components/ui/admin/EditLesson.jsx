import axios from "axios";
import { useApp } from "../../../context/AppContextProvider";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../../../helper/toastMessage";

function EditLesson() {
  const [lessonData, setLessonData] = useState({
    title: "",
    content: "",
    videoUrl: "",
  });

  const { id } = useParams();
  const { baseUrl, getLessonById } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "videoUrl") {
      // Handle file input separately
      setLessonData({ ...lessonData, videoUrl: files[0] });
    } else {
      setLessonData({ ...lessonData, [name]: value });
    }
  };

  const handleContentChange = (value) => {
    setLessonData((prev) => ({ ...prev, content: value }));
  };

  const getLesson = async () => {
    const res = await getLessonById(id);

    const lesson = res.data;

    setLessonData({
      title: lesson.title,
      content: lesson.content,
    });
  };

  useEffect(() => {
    getLesson(); // call method
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const form = new FormData();

    // Append form fields to FormData
    Object.keys(lessonData).forEach((key) => {
      form.append(key, lessonData[key]);
    });

    try {
      const res = await axios.put(`${baseUrl}/lesson/edit/${id}`, lessonData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.status === 200) {
        showToast(res.data.message, "success");
        navigate("/instructor/lessons");
      }

      setLessonData({
        title: "",
        content: "",
        videoUrl: "",
      });
    } catch (error) {
      console.error("Error while editing lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full p-8 rounded-lg max-w-xl bg-formBackground"
      >
        <p className="text-xl text-white text-center font-semibold">
          Edit Lesson
        </p>
        <div className="mt-4">
          <label className="block text-white text-sm font-semibold mb-2">
            Title
          </label>
          <input
            className="bg-transparent text-white focus:outline-none focus:shadow-outline border rounded py-2 px-2 block w-full"
            name="title"
            value={lessonData.title}
            onChange={handleChange}
            type="text"
            required
          />
        </div>
        <div className="mt-4">
          <label className="block text-white text-sm font-semibold mb-2">
            Content
          </label>
          <ReactQuill
            name="description"
            value={lessonData.content}
            onChange={handleContentChange}
            className="text-white rounded"
          />
        </div>
        <div className="mt-4">
          <div className="flex justify-between">
            <label className="block text-white text-sm font-semibold mb-2">
              Video File
            </label>
          </div>
          <input
            className="text-sm text-gray-200 file:mr-5 file:py-2 file:px-3 file:border-[1px] file:text-sm file:rounded file:font-medium file:bg-transparent file:text-white hover:file:cursor-pointer"
            name="videoUrl"
            onChange={handleChange}
            type="file"
            accept="video/*"
          />
        </div>
        <div className="mt-8">
          <button
            disabled={isLoading}
            className="bg-gradient-to-r from-gradient-start to-gradient-end text-white font-semibold py-3 px-2 w-full rounded-md cursor-pointer flex justify-center items-center text-center"
          >
            {isLoading ? (
              <div className="border-formBackground h-5 w-5 animate-spin rounded-full border-[3px] border-t-cyan-600" />
            ) : (
              "Edit Lesson"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditLesson;
