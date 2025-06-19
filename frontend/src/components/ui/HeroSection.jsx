import React from "react";
import heroImg from "/assets/e-learning.jpg";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { useApp } from "../../context/AppContextProvider";

const HeroSection = () => {
  const { user } = useApp();

  return (
    <section className="pt-20 lg:pt-24 pb-20 px-5 md:px-10 my-8 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-6 lg:gap-5 z-20">
        {/* Left Content */}
        <div className="text-center md:text-left flex-1 order-2 md:order-1 p-3">
          <Fade triggerOnce>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-wide font-custom">
              Unlock Your Learning Potential With{" "}
              <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent leading-normal">
                EduHub
              </span>
            </h1>
          </Fade>
          <p className="text-gray-200 mb-6 text-lg">
            Join thousands of learners and access top-quality courses, anytime,
            anywhere.
          </p>
          {user == null ? (
            <Link
              to="/login"
              className="bg-gradient-to-r from-gradient-start to-gradient-end text-white px-4 py-3 rounded-lg font-semibold text-lg inset-1 transition-all shadow hover:ring-1 hover:ring-white duration-300 hover:ring-offset-1
"
            >
              Get Started
            </Link>
          ) : (
            <Link
              to="/allcourses"
              className="bg-gradient-to-r from-gradient-start to-gradient-end text-white px-4 py-3 rounded-lg font-semibold text-lg inset-1 transition-all shadow hover:ring-1 hover:ring-white duration-300 hover:ring-offset-1
"
            >
              Browse Courses
            </Link>
          )}
        </div>

        {/* right side */}
        <div className="md:order-2 p-3 flex justify-center items-center">
          <img
            src={heroImg}
            alt="e-learning"
            className="z-10 lg:max-w-md object-contain rounded-2xl shadow-lg order-1"
          />
        </div>
      </div>

      <div className="absolute bottom-4 right-4 text-gray-500 select-none animate-bounce">
        <code>hello world</code>
      </div>

      <div className="absolute top-10 right-5 rotate-45">
        <svg
          width="60"
          height="60"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {" "}
          <g clipPath="url(#clip0_119_243)">
            {" "}
            <path
              d="M99.995 200V143.969L0 99.995H56.0313L99.995 0V56.0313L200 99.995H143.969L99.995 200Z"
              fill="url(#paint0_linear_119_243)"
            />{" "}
          </g>{" "}
          <defs>
            {" "}
            <linearGradient
              id="paint0_linear_119_243"
              x1="177"
              y1="-9.23648e-06"
              x2="39.5"
              y2="152.5"
              gradientUnits="userSpaceOnUse"
            >
              {" "}
              <stop stopColor="#B0B9FF" />{" "}
              <stop offset="1" stopColor="#E7E9FF" />{" "}
            </linearGradient>{" "}
            <clipPath id="clip0_119_243">
              {" "}
              <rect width="200" height="200" fill="white" />{" "}
            </clipPath>{" "}
          </defs>{" "}
        </svg>
      </div>
      <div className="absolute bottom-0 left-10">
        <svg
          width="40"
          height="40"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {" "}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M122.363 90.3495C117.674 95.9288 117.674 104.071 122.363 109.65L160.767 155.349C168.968 165.108 162.031 180 149.284 180H51.0288C38.2821 180 31.3446 165.108 39.5454 155.349L77.9499 109.65C82.6386 104.071 82.6386 95.9288 77.9498 90.3495L39.5453 44.6504C31.3446 34.8921 38.2821 20 51.0288 20L149.284 20C162.03 20 168.968 34.8921 160.767 44.6504L122.363 90.3495Z"
            fill="url(#paint0_linear_105_736)"
          />{" "}
          <defs>
            {" "}
            <linearGradient
              id="paint0_linear_105_736"
              x1="149.557"
              y1="20"
              x2="39.7213"
              y2="117.692"
              gradientUnits="userSpaceOnUse"
            >
              {" "}
              <stop stopColor="#B0B9FF" />{" "}
              <stop offset="1" stopColor="#E7E9FF" />{" "}
            </linearGradient>{" "}
          </defs>{" "}
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
