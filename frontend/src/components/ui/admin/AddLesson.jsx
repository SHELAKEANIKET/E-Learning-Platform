import { useApp } from "../../../context/AppContextProvider";
import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function AddLesson() {
  const [lessonData, setLessonData] = useState({
    title: "",
    content: "",
    videoUrl: "",
  });

  const { addLessonInCourse } = useApp();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = addLessonInCourse(lessonData);

    setLessonData({
      title: "",
      content: "",
      videoUrl: "",
    });
  };

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full p-8 border rounded-lg max-w-xl bg-formBackground"
      >
        <p className="text-xl text-primary text-center font-semibold">
          Add New Lesson
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
            required
          />
        </div>
        <div className="mt-8">
          <button className="bg-primary text-white font-semibold py-3 px-2 w-full rounded-md cursor-pointer">
            Add Lesson
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddLesson;
