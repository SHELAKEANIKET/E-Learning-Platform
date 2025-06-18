import Courses from "../components/ui/Courses";
import HeroSection from "../components/ui/HeroSection";
import WhyChooseUs from "../components/ui/WhyChooseUs";
import Testimonal from "../components/ui/Testimonal";
import React from "react";

function Home() {
  return (
    <div className="container mx-auto">
      <HeroSection />
      <div className="w-full h-px my-6 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      <WhyChooseUs />
      <div className="w-full h-px my-6 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      <Courses />
      <div className="w-full h-px my-6 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      <Testimonal />
    </div>
  );
}

export default Home;
