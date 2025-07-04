import React from "react";
import { Check } from "lucide-react";
import onlineLearningImage from "/assets/onlineLearning.jpg";
import { Slide, Zoom } from "react-awesome-reveal";

const WhyChooseUs = () => {
  return (
    <section className="relative py-4">
      <span className="absolute bg-blue-600/40 w-60 h-60 rounded-full blur-3xl top-0 -right-10 sm:top-20 sm:right-0 z-10"></span>
      <div className="flex flex-col md:flex-row items-center justify-center md:gap-24 px-6 py-20 max-w-7xl mx-auto relative opacity-100 z-20">
        <div className="w-full md:w-1/3 mb-8 md:mb-0">
          <img
            src={onlineLearningImage}
            alt="Online Learning"
            className="rounded-2xl shadow-lg w-full h-auto object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 md:pl-12">
          <Zoom triggerOnce>
            <h2 className="text-xl lg:text-2xl font-bold mb-6 text-white">
              🚀 Why Choose Our Online Learning Platform?
            </h2>
          </Zoom>

          <div className="space-y-5">
            <Slide direction="up" triggerOnce delay={100}>
              <div className="flex items-start gap-4">
                <Check className="bg-primary text-white rounded-full p-1 mt-1 size-5 lg:size-6 flex-shrink-0" />
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-white">
                    Wide Range of Courses
                  </h4>
                  <p className="text-white/90">
                    Learn everything from programming to photography with expert
                    instructors.
                  </p>
                </div>
              </div>
            </Slide>

            <Slide direction="up" triggerOnce delay={300}>
              <div className="flex items-start gap-4">
                <Check className="bg-primary text-white rounded-full p-1 mt-1 size-5 lg:size-6 flex-shrink-0" />
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-white">
                    Flexible Learning
                  </h4>
                  <p className="text-white/90">
                    Study at your own pace, anytime, anywhere.
                  </p>
                </div>
              </div>
            </Slide>

            <Slide direction="up" triggerOnce delay={700}>
              <div className="flex items-start gap-4">
                <Check className="bg-primary text-white rounded-full p-1 mt-1 size-5 lg:size-6 flex-shrink-0" />
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-white">
                    Certification & Support
                  </h4>
                  <p className="text-white/90">
                    Earn certificates and get help from dedicated mentors.
                  </p>
                </div>
              </div>
            </Slide>
          </div>
        </div>
        <div className="absolute bottom-2 right-2">
          <svg
            viewBox="0 0 256 256"
            width="36"
            height="36"
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
    </section>
  );
};

export default WhyChooseUs;
