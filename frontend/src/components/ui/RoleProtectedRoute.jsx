import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContextProvider";
import React from "react";

function RoleProtectedRoute({ children, role }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;

  return children;
}

export default RoleProtectedRoute;
