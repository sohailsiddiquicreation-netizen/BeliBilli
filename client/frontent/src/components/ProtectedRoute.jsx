import { Navigate } from "react-router-dom";

// Protects routes that require login
export function RequireAuth({ children, redirectTo = "/login" }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to={redirectTo} replace />;
  return children;
}

// Protects routes that require admin role
export function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
