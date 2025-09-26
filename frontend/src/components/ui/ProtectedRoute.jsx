import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContextProvider";
import React from "react";

function ProtectedRoute({ children }) {
  const { user, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
