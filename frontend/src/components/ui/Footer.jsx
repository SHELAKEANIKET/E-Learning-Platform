import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <div className="py-8 px-4 flex flex-col items-center justify-center">
      <div className="w-full h-px mb-8 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      <div className="mt-8 p-1 lg:mx-10 grid grid-cols-1 md:grid-cols-3 custom-width:grid-cols-3 lg:grid-cols-3 gap-10 md:gap-4 text-left text-gray-300">
        <div className="items-start flex flex-col md:items-start gap-3">
          <h2 className="text-xl font-semibold">About EduHub</h2>
          <p className="text-base leading-relaxed">
            EduHub is a modern e-learning platform offering interactive and
            expert-led courses to help you upskill efficiently. Learn at your
            own pace with our engaging, project-based content.
          </p>
        </div>
        <div className="items-start flex flex-col md:items-center gap-3">
          <h2 className="text-xl font-semibold">Connect With Us</h2>
          <div className="flex gap-2 text-2xl mt-2">
            <a
              href="#"
              className="p-1.5 rounded-full hover:transform hover:scale-110 duration-300 bg-blue-600"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="p-1.5 rounded-full hover:transform hover:scale-110 duration-300 bg-black"
            >
              <FaXTwitter />
            </a>
            <a
              href="#"
              className="p-1.5 rounded-full hover:transform hover:scale-110 duration-300 bg-pink-500"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="p-1.5 rounded-full hover:transform hover:scale-110 duration-300 bg-blue-700"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
        <div className="items-start flex flex-col md:items-center gap-3">
          <h2 className="text-xl font-semibold">For Any Queries</h2>
          <div className="flex justify-center items-center gap-1 mt-2">
            <p className="bg-red-500 p-1.5 rounded-full">
              <MdOutlineMail className="size-5" />
            </p>
            <p className="text-md font-medium">support@eduhub.com</p>
          </div>
        </div>
      </div>
      <h1 className="mt-10 text-6xl sm:text-7xl lg:text-[144px] tracking-wider font-extrabold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent leading-normal">
        EDUHUB
      </h1>
    </div>
  );
}

export default Footer;
