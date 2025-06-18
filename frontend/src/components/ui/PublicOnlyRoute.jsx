import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContextProvider";
import React from "react";

function PublicOnlyRoute({ children }) {
  const { user } = useApp();
  return user ? <Navigate to="/" replace /> : children;
}

export default PublicOnlyRoute;
