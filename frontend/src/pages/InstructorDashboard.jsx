import { Sidebar } from "../components/ui/Sidebar";
import React from "react";
import { Outlet } from "react-router-dom";

function InstructorDashboard() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <Sidebar />
      <div className="sm:ml-64 p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default InstructorDashboard;