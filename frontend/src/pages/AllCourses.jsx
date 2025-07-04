import { Link } from "react-router-dom";
import React, { useState } from "react";
import starIcon from "/assets/star.png";
import { useApp } from "../context/AppContextProvider";
import LoadingAnimation from "../components/ui/LoadingAnimation";
import { Fade } from "react-awesome-reveal";

const categories = [
  "All",
  "Programming",
  "Web Development",
  "App Development",
  "AI/ML",
  "Data Science",
  "Devops",
];

function AllCourses() {
  const { courses } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("All");

  if (courses?.length === 0) {
    return (
      <div className="my-20 lg:mx-20 mx-3">
        <div className="flex justify-center items-center flex-col">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent leading-normal">
            Our Courses
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-5 gap-4 lg:gap-10 place-items-center my-8">
            <LoadingAnimation />
            <LoadingAnimation />
            <LoadingAnimation />
          </div>
        </div>
      </div>
    );
  }

  const filteredCourses = courses.filter((course) => {
    const matchCategory =
      selectedCategory === "All" || course.category === selectedCategory;

    return matchCategory;
  });

  return (
    <div className="my-20 lg:mx-16 mx-2">
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent leading-normal">
          Our Courses
        </h1>
        <div className="flex justify-start lg:justify-center items-center w-full m-4 px-4 gap-2 lg:overflow-x-hidden overflow-x-auto scroll-smooth hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full border border-gray-700 text-center ${
                selectedCategory === cat
                  ? "bg-primary text-white"
                  : "bg-transparent text-white"
              } hover:bg-primary hover:text-white transition-all whitespace-nowrap`}
            >
              {cat}
            </button>
          ))}
        </div>
        <Fade triggerOnce>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-4 gap-4 lg:gap-6 my-8">
            {filteredCourses.length > 0 ? (
              filteredCourses?.map((course) => (
                <div
                  className="rounded-lg overflow-hidden shadow-md shadow-primary/30 flex justify-center items-center flex-col lg:w-84 w-full hover:transform hover:scale-105 transition-all duration-500 border-2 border-primary/20"
                  key={course._id}
                >
                  <div className="flex justify-center items-start flex-col w-full text-white gap-1 pb-2">
                    <div className="h-56 flex justify-center items-center w-full">
                      <img
                        className="w-full h-full max-h-full object-fill"
                        src={course.thumbnail}
                        alt="course Image"
                      />
                    </div>
                    <div className="p-2 flex justify-start items-center gap-1">
                      <img
                        src={starIcon}
                        alt="rating icon"
                        className="w-4 h-4"
                      />
                      <span className="font-medium">4.5</span>
                    </div>
                    <h3 className="text-lg font-medium mb-1 px-2">
                      {course.title}
                    </h3>
                    <div className="flex items-center justify-between w-full px-2">
                      <span className="font-medium text-lg">
                        ₹{course.price}
                      </span>
                      <Link
                        to={`/course/${course._id}`}
                        className="bg-primary text-white font-medium py-1.5 px-2 shadow rounded"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="mx-auto w-full text-white">
                No courses available for {selectedCategory}
              </p>
            )}
          </div>
        </Fade>
      </div>
    </div>
  );
}

export default AllCourses;
