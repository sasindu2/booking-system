import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const adminToken = Cookies.get("adminToken");

  if (!adminToken) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default ProtectedRoute;
