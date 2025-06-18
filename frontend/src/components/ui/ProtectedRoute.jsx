import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContextProvider";
import React from "react";

function ProtectedRoute({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
