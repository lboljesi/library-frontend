import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CategoriesPage from "./pages/CategoriesPage";

import BulkBookCategoryManagerPage from "./pages/BulkBookCategoryManagerPage";
import LoansList from "./components/LoansList";
import EditLoan from "./components/EditLoan";
import AddLoan from "./components/AddLoan";

import BooksCrud from "./components/Books.jsx";
import AuthorsCrud from "./components/Authors.jsx";

import MembersTable from "./components/MembersTable.jsx";
import EditMemberModal from "./components/EditMemberModal.jsx";
import AddMember from "./components/AddMember.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/authors" element={<AuthorsCrud />} />
        <Route path="/books" element={<BooksCrud />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route
          path="/bulk-category-manager"
          element={<BulkBookCategoryManagerPage />}
        />
        <Route path="/loans" element={<LoansList />} />
        <Route path="/loans/edit/:id" element={<EditLoan />} />
        <Route path="/loans/add" element={<AddLoan />} />
        <Route path="/members" element={<MembersTable />} />
        <Route path="/members/edit/:id" element={<EditMemberModal />} />
        <Route path="/members/add" element={<AddMember />} />
      </Routes>
    </div>
  );
}

export default App;
