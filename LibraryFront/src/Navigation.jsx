import { Link } from "react-router-dom";

export default function Navigation() {
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
      </div>
    </nav>
  );
}
