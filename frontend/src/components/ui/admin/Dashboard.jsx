import axios from "axios";
import { useApp } from "../../../context/AppContextProvider";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, defaults } from "chart.js/auto";

function Dashboard() {
  const { instructorCourses, baseUrl, loadingCourses } = useApp();
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
  defaults.plugins.backgroundColor = "black";

  return (
    <>
      <div className="flex justify-center items-center lg:mx-10">
        <div className="flex justify-center items-center flex-col text-white gap-4 bg-gradient-to-r from-purple-500 to bg-blue-500 p-4 rounded-lg">
          <p className="text-2xl font-bold">Your Total Courses</p>
          {loadingCourses ? (
            <div className="border-formBackground h-5 w-5 animate-spin rounded-full border-[3px] border-t-cyan-600" />
          ) : (
            <p className="text-3xl font-bold">{instructorCourses?.length}</p>
          )}
        </div>
      </div>

      {revenueData?.length > 0 ? (
        <div className="max-w-4xl mx-auto mt-6 bg-formBackground p-4 shadow h-[420px]">
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
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: "Monthly Revenue",
                  color: "white",
                },
                legend: {
                  labels: {
                    color: "white",
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: "white",
                    font: {
                      size: 12,
                    },
                  },
                  grid: {
                    color: "rgba(255,255,255,0.1)",
                  },
                },
                y: {
                  beginAtZero: true,
                  suggestedMax: 5000,
                  ticks: {
                    stepSize: 1000,
                    color: "white",
                    callback: (value) => `${value}`,
                  },
                  grid: {
                    color: "rgba(255,255,255,0.1)",
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Dashboard;
