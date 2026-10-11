import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser } from "../api";

export default function ProtectedRoute({ allowedRole }) {
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/volunteer/dashboard"} replace />;
  }

  return <Outlet />;
}
