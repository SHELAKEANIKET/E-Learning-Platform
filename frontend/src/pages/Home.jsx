import Courses from "../components/ui/Courses";
import HeroSection from "../components/ui/HeroSection";
import WhyChooseUs from "../components/ui/WhyChooseUs";
import Testimonal from "../components/ui/Testimonal";
import React, { useEffect, useState } from "react";
import LoadingToast from "../components/ui/LoadingToast";

function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = "http://localhost:9000/api" || import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetch(`${baseUrl}/health`)
      .then((res) => {
        if (res.ok) setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(true);
        console.error("Error checking server health:", error);
      });
  }, []);

  return (
    <div className="container mx-auto">
      <HeroSection />
      <div className="w-full h-px my-6 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      <WhyChooseUs />
      <div className="w-full h-px my-6 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      <Courses />
      <div className="w-full h-px my-6 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      <Testimonal />
      <LoadingToast isLoading={isLoading} />
    </div>
  );
}

export default Home;
