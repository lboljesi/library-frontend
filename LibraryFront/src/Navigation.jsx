import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

function Navigation() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  if (!token) return null;
  return (
    <nav>
      <div>
        <Link to="/">Home</Link>

        <Link to="/categories">Categories</Link>
        <Link to="/bulk-category-manager">Bulk Category Manager</Link>
        <Link to="/books">Books</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
export default Navigation;
