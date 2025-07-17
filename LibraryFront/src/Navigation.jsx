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
        <Link to="/" className="btn-nav">
          Home
        </Link>

        <Link to="/categories" className="btn-nav">
          Categories
        </Link>
        <Link to="/bulk-category-manager" className="btn-nav">
          Bulk Category Manager
        </Link>
        <Link to="/books" className="btn-nav">
          Books
        </Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
export default Navigation;
