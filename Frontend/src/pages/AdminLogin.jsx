import { Navigate } from "react-router-dom";

// Admin login entry — sends the user to the standard login flow, then back
// to the admin dashboard after successful authentication.
export default function AdminLogin() {
  return <Navigate to="/login?returnTo=%2Fadmin" replace />;
}