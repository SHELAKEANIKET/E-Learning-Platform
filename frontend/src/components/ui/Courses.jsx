import { Link } from "react-router-dom";
import React from "react";
import { useApp } from "../../context/AppContextProvider";
import starIcon from "/assets/star.png";
import { Slide, Zoom } from "react-awesome-reveal";
import LoadingAnimation from "./LoadingAnimation";

function Courses() {
  const { courses } = useApp();

  if (courses?.length === 0) {
    return (
      <div className="my-10 lg:mx-20 mx-3">
        <div className="flex justify-center items-center flex-col">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent leading-normal">
            Our Courses
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-5 gap-4 lg:gap-16 place-items-center my-8">
            <LoadingAnimation />
            <LoadingAnimation />
            <LoadingAnimation />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-20 lg:mx-16 mx-3 relative">
      <div className="flex justify-center items-center flex-col w-full">
        <Zoom triggerOnce>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent leading-normal">
            Our Courses
          </h1>
        </Zoom>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 custom-width:grid-cols-3 lg:grid-cols-3 mx-4 gap-4 lg:gap-5 place-items-center my-8">
          {courses &&
            courses?.slice(0, 3).map((course, index) => (
              <div
                className="rounded-lg overflow-hidden shadow-md shadow-primary/30 flex justify-center items-center flex-col border-2 border-primary/20"
                key={course._id}
              >
                <div className="flex justify-center items-start flex-col max-w-[340px] text-white gap-1 pb-2 z-20">
                  <div className="h-56 flex justify-center items-center w-full">
                    <img
                      className="w-full h-full max-h-full object-fill"
                      src={course.thumbnail}
                      alt="course Image"
                    />
                  </div>
                  <div className="p-2 flex justify-center items-center gap-1 flex-shrink-0">
                    <img src={starIcon} alt="rating icon" className="w-4 h-4" />
                    <span className="font-medium text-lg">4.5</span>
                  </div>
                  <h3 className="text-lg font-medium mb-1 px-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between w-full px-2">
                    <span className="font-medium text-lg">₹{course.price}</span>
                    <Link
                      to={`/course/${course._id}`}
                      className="bg-primary text-white font-medium py-1.5 px-2 shadow rounded"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <Link
          to="/allcourses"
          className="bg-gradient-to-r from-gradient-start to-gradient-end text-white px-3 py-2 rounded text-base font-semibold cursor-pointer inset-1 transition-all shadow hover:ring-1 hover:ring-white duration-300 hover:ring-offset-1"
        >
          Explore More
        </Link>
      </div>
      <div className="absolute -bottom-4">
        <svg
          viewBox="0 0 256 256"
          width="30"
          height="30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect fill="none" height="4" width="4" />
          <path
            fill="lightBlue"
            d="M70.1,82.9a7.8,7.8,0,0,0-11.2-1l-48,40a7.9,7.9,0,0,0,0,12.2l48,40a7.8,7.8,0,0,0,11.2-1,7.8,7.8,0,0,0-1-11.2L28.5,128,69.1,94.1A7.8,7.8,0,0,0,70.1,82.9Z"
          />
          <path
            fill="lightBlue"
            d="M245.1,121.9l-48-40a8,8,0,0,0-10.2,12.2L227.5,128l-40.6,33.9A8,8,0,0,0,192,176a7.7,7.7,0,0,0,5.1-1.9l48-40a7.9,7.9,0,0,0,0-12.2Z"
          />
          <path
            fill="lightBlue"
            d="M162.7,32.5a7.9,7.9,0,0,0-10.2,4.8l-64,176a7.9,7.9,0,0,0,4.8,10.2,8.6,8.6,0,0,0,2.7.5,7.9,7.9,0,0,0,7.5-5.3l64-176A7.9,7.9,0,0,0,162.7,32.5Z"
          />
        </svg>
      </div>
    </div>
  );
}

export default Courses;
