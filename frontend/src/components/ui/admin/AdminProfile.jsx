import { useApp } from "../../../context/AppContextProvider";
import React from "react";
import profile from "/assets/profile.jpg";

function AdminProfile() {
  const { user } = useApp();

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center mb-10 border w-fit mx-auto">
        <img
          src={profile}
          alt="User Avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 shadow-md mb-4"
        />
        <h2 className="text-3xl font-bold text-black">{user?.name}</h2>
        <p className="text-black">{user?.email}</p>
      </div>
    </>
  );
}

export default AdminProfile;
