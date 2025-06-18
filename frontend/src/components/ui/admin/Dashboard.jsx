import axios from "axios";
import { useApp } from "../../../context/AppContextProvider";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, defaults } from "chart.js/auto";

function Dashboard() {
  const { instructorCourses, baseUrl } = useApp();
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get(`${baseUrl}/enrollment/revenue`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setRevenueData(res.data);
      } catch (err) {
        console.error("Failed to fetch revenue data", err);
      }
    };
    fetchRevenue();
  }, []);

  defaults.maintainAspectRatio = false;
  defaults.responsive = true;
  defaults.plugins.title.display = true;
  defaults.plugins.title.align = "start";
  defaults.plugins.title.font.size = 24;
  defaults.plugins.title.color = "black";

  return (
    <>
      <div className="flex justify-center items-center lg:mx-10">
        <div className="flex justify-center items-center flex-col text-white gap-4 bg-gradient-to-r from-purple-500 to bg-blue-500 p-4 rounded-lg">
          <p className="text-2xl font-bold">Your Total Courses</p>
          <p className="text-3xl font-bold">{instructorCourses?.length}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-6 bg-white p-4 shadow h-[420px]">
        <Bar
          data={{
            labels: revenueData.map((data) => data.label),
            datasets: [
              {
                label: "Revenue",
                data: revenueData.map((data) => data.revenue),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.8)",
                  "rgba(255, 159, 64, 0.8)",
                  "rgba(255, 205, 86, 0.8)",
                  "rgba(75, 192, 192, 0.8)",
                  "rgba(153, 102, 255, 0.8)",
                  "rgba(54, 162, 235, 0.8)",
                ],
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Monthly Revenue",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                suggestedMax: 5000,
                ticks: {
                  stepSize: 1000,
                  callback: (value) => `${value}`,
                },
              },
            },
          }}
        />
      </div>
    </>
  );
}

export default Dashboard;
