import { useApp } from "../../../context/AppContextProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";

function EditCourse() {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    courseThumbnail: null,
  });

  const { baseUrl, getCourseById } = useApp();
  const { id } = useParams();
  const navigate = useNavigate();

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

  const getCourse = async () => {
    const res = await getCourseById(id);

    const course = res.data;

    setCourseData({
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
    });
  };

  useEffect(() => {
    getCourse(); // call method
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    // Append form fields to FormData
    Object.keys(courseData).forEach((key) => {
      form.append(key, courseData[key]);
    });

    try {
      const response = await axios.put(
        `${baseUrl}/course/edit/${id}`,
        courseData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        navigate("/allcourses");
      }

      setCourseData({
        title: "",
        description: "",
        category: "",
        price: "",
        courseThumbnail: null,
      });
    } catch (error) {
      console.error("Error while editing course:", error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl p-8 rounded-lg bg-formBackground"
      >
        <p className="text-xl text-white text-center font-medium">
          Edit Course
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
            className="text-sm text-gray-200 file:mr-5 file:py-2 file:px-3 file:border-[1px] file:text-sm file:rounded file:font-medium file:bg-transparent file:text-white
     hover:file:cursor-pointer"
            name="courseThumbnail"
            onChange={handleChange}
            type="file"
            accept="image/*"
          />
        </div>
        <div className="mt-8">
          <button className="bg-gradient-to-r from-gradient-start to-gradient-end text-white font-semibold py-3 px-2 w-full rounded-md cursor-pointer">
            Edit Course
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCourse;
