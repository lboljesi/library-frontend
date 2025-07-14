import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { isTokenExpired } from "../utils/jwt";

function RequireAuth({ children }) {
  const { token, logout } = useContext(AuthContext);
  const location = useLocation();

  if (!token || isTokenExpired(token)) {
    if (token && isTokenExpired(token)) {
      logout();
    }
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}
export default RequireAuth;
