import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="max-w-screen-lg mx-auto flex flex-wrap gap-2 justify-center">
        <Link to="/" className="btn-nav">
          Home
        </Link>
        <Link to="/books" className="btn-nav">
          Books
        </Link>
        <Link to="/authors" className="btn-nav">
          Authors
        </Link>
        <Link to="/categories" className="btn-nav">
          Categories
        </Link>
        <Link to="/bulk-category-manager" className="btn-nav">
          Bulk Category Manager
        </Link>
        <Link to="/loans" className="btn-nav">
          Loans
        </Link>
        <Link to="/members" className="btn-nav">
          Members
        </Link>
      </div>
    </nav>
  );
}
