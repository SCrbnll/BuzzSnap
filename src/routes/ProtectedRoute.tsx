import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const parsedUser = JSON.parse(user);
  const theme = parsedUser?.theme || "green";
  document.body.setAttribute("data-theme", theme);

  return children;
};

export default ProtectedRoute;
