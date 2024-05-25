import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Provider/authProvider";

type Props = { children: React.ReactNode };

export const ProtectedRoute = ({ children }: Props) => {
  const location = useLocation();
  const { token } = useAuth();

  return token ? (
    <>{children}</>
  ) : (
    <Navigate to="/singin" state={{ from: location }} replace />
  );
};