import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CategoriesPage from "./pages/CategoriesPage";
import BulkBookCategoryManagerPage from "./pages/BulkBookCategoryManagerPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/LoginPage";
import RequireAuth from "./routes/RequireAuth";
import RegisterPage from "./pages/RegisterPage";
import BooksPage from "./pages/BooksPage";
import MembersPage from "./pages/MembersPage";

function App() {
  return (
    <div>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<MembersPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />

        <Route
          path="/categories"
          element={
            <RequireAuth>
              <CategoriesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/bulk-category-manager"
          element={
            <RequireAuth>
              <BulkBookCategoryManagerPage />
            </RequireAuth>
          }
        />
        <Route path="/books" element={<BooksPage />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </div>
  );
}

export default App;
