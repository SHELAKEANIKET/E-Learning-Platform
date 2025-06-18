import React, { useCallback } from "react";
import userImg from "/assets/user.jpg";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

function Testimonal() {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="my-10 py-10 ">
      <div className="flex justify-center items-center flex-col gap-10 mx-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent leading-normal">
          Testimonial 
        </h1>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex my-4 max-w-2xl">
            <div className="flex justify-center items-center gap-5 flex-col flex-shrink-0 w-full">
              <div>
                <Quote className="size-8 text-[#1cb49b]" />
              </div>
              <h2 className="text-center text-white">
                "I love how simple and interactive the courses are on EduHub.
                The quizzes and assignments really help me retain what I learn."
              </h2>
              <div className="flex justify-center items-center gap-4">
                <img
                  src={userImg}
                  alt="user-image"
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <h2 className="text-white">Rohan Mehta</h2>
                  <p className="text-white">College Student</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center gap-5 flex-col flex-shrink-0 w-full">
              <div>
                <Quote className="size-8 text-[#1cb49b]" />
              </div>
              <h2 className="text-center text-white">
                "EduHub makes learning so easy and accessible. I can learn
                anytime on my phone, even during my commute."
              </h2>
              <div className="flex justify-center items- gap-4">
                <img
                  src={userImg}
                  alt="user-image"
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <h2 className="text-white">Vikram Das</h2>
                  <p className="text-white">College Student</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center gap-5 flex-col flex-shrink-0 w-full">
              <div>
                <Quote className="size-8 text-[#1cb49b]" />
              </div>
              <h2 className="text-center text-white">
                "EduHub has completely transformed the way I learn. The flexible
                schedule and expert instructors helped me balance my job and
                studies perfectly!"
              </h2>
              <div className="flex justify-center items- gap-4">
                <img
                  src={userImg}
                  alt="user-image"
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <h2 className="text-white">Rohit Kumar</h2>
                  <p className="text-white">College Student</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-5 pt-5">
            <button className="text-[#1cb49b] border-2 border-[#1cb49b] rounded-full p-1" onClick={scrollPrev}>
              <ChevronLeft />
            </button>
            <button className="text-[#1cb49b] border-2 border-[#1cb49b] rounded-full p-1" onClick={scrollNext}>
              <ChevronRight />
            </button> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonal;
