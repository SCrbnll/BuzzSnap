import LocalStorageCalls from "@/context/localStorageCalls";
import TokenUtils from "@/utils/TokenUtils";
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = LocalStorageCalls.getStorageUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  const userDecoded = TokenUtils.decodeToken(token);
  
  const theme = userDecoded?.theme || "green";
  document.body.setAttribute("data-theme", theme);

  return children;
};

export default ProtectedRoute;
