import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CategoriesPage from "./pages/CategoriesPage";
import BulkBookCategoryManagerPage from "./pages/BulkBookCategoryManagerPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/categories" element={<CategoriesPage />} />
        <Route
          path="/bulk-category-manager"
          element={<BulkBookCategoryManagerPage />}
        />
      </Routes>
    </div>
  );
}

export default App;
