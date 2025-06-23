import { showToast } from "../../../helper/toastMessage";
import { useApp } from "../../../context/AppContextProvider";
import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function AddCourse() {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    courseThumbnail: null,
  });
  const { addCourse } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "courseThumbnail") {
      // Handle file input separately
      setCourseData({ ...courseData, courseThumbnail: files[0] });
    } else {
      setCourseData({ ...courseData, [name]: value });
    }
  };
  const handleDescriptionChange = (value) => {
    setCourseData((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = addCourse(courseData);

      setCourseData({
        title: "",
        description: "",
        category: "",
        price: "",
        courseThumbnail: "",
      });

      if (res.status === 201) {
        showToast(res.data.message, "success");
      }
    } catch (error) {
      console.log("Error:", error);
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
          Add Course
        </p>
        <div className="mt-4">
          <label className="block text-white text-sm font-semibold mb-2">
            Title
          </label>
          <input
            className="bg-transparent text-white focus:outline-none focus:shadow-outline border rounded py-2 px-2 block w-full"
            name="title"
            value={courseData.title}
            onChange={handleChange}
            type="text"
            required
          />
        </div>
        <div className="mt-4">
          <label className="block text-white text-sm font-semibold mb-2">
            Description
          </label>
          <ReactQuill
            name="description"
            value={courseData.description}
            onChange={handleDescriptionChange}
            className="text-white rounded"
          />
        </div>
        <div className="mt-4">
          <div className="flex justify-between">
            <label className="block text-white text-sm font-semibold mb-2">
              Price
            </label>
          </div>
          <input
            className="bg-transparent text-white focus:outline-none focus:shadow-outline border rounded py-2 px-2 block w-full"
            name="price"
            value={courseData.price}
            onChange={handleChange}
            type="number"
            required
          />
        </div>
        <div className="mt-4">
          <div className="flex justify-between">
            <label className="block text-white text-sm font-semibold mb-2">
              Course Category
            </label>
          </div>
          <select
            name="category"
            id="category"
            value={courseData.category}
            onChange={handleChange}
            className="bg-transparent text-white focus:outline-none focus:shadow-outline border rounded py-2 px-2 block w-full appearance-none cursor-pointer overflow-hidden"
          >
            <option value="" className="bg-[#1f2024]">
              Select Course Category
            </option>
            <option value="Programming" className="bg-[#1f2024]">
              Programming
            </option>
            <option value="Web Development" className="bg-[#1f2024]">
              Web Development
            </option>
            <option value="App Development" className="bg-[#1f2024]">
              App Development
            </option>
            <option value="AI/ML" className="bg-[#1f2024]">
              AI/ML
            </option>
            <option value="Data Science" className="bg-[#1f2024]">
              Data Science
            </option>
            <option value="Devops" className="bg-[#1f2024]">
              Devops
            </option>
          </select>
        </div>
        <div className="mt-4">
          <div className="flex justify-between">
            <label className="block text-white text-sm font-semibold mb-2">
              Course Thumbnail
            </label>
          </div>
          <input
            className="text-sm text-gray-200 file:mr-5 file:py-2 file:px-3 file:border-[1px] file:text-sm file:rounded file:font-medium file:bg-transparent file:text-white hover:file:cursor-pointer"
            name="courseThumbnail"
            onChange={handleChange}
            type="file"
            accept="image/*"
            required
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
              "Add Course"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCourse;
