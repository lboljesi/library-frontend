import { useEffect, useState } from "react";
import api, {
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/api";

import SortSelector from "./SortSelector";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import { useSearchParams } from "react-router-dom";
import ResetFilters from "./ResetFilters";
import React from "react";
import BooksByCategory from "./BooksByCategory";
import EditCategoryModal from "./EditCategoryModal";
import AddCategoryModal from "./AddCategoryModal";

function CategoryList() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  const [totalCount, setTotalCount] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("search") || ""
  );
  const [sortDesc, setSortDesc] = useState(searchParams.get("desc") === "true");
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1);
  const [pageSize, setPageSize] = useState(
    Number(searchParams.get("pageSize")) || 10
  );

  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const fetchCategories = () => {
    getCategories({
      desc: sortDesc,
      search: debouncedSearch,
      page: currentPage,
      pageSize: pageSize,
    })
      .then((response) => {
        setCategories(response.data.items);
        setTotalCount(response.data.totalCount);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, [debouncedSearch, sortDesc, currentPage, pageSize]);

  useEffect(() => {
    setSearchParams({
      search: searchText,
      desc: sortDesc,
      page: currentPage,
      pageSize: pageSize,
    });
  }, [searchText, sortDesc, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, sortDesc, pageSize]);

  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    setDeletingCategoryId(id);

    deleteCategory(id)
      .then(() => {
        fetchCategories();
      })
      .catch((error) => {
        console.error("Error deleting category", error);
      })
      .finally(() => {
        setDeletingCategoryId(null);
      });
  }

  const openEditModal = (category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (id) => {
    if (!editingCategoryName.trim()) {
      setEditError("Name is required.");
      return;
    }

    setEditError("");
    setEditLoading(true);

    updateCategory(id, editingCategoryName)
      .then(() => {
        setEditingCategoryId(null);
        setEditingCategoryName("");
        setIsEditModalOpen(false);
        fetchCategories();
      })
      .catch((error) => {
        console.error("Error updating category", error);
        setEditError("Failed to update category.");
      })
      .finally(() => setEditLoading(false));
  };

  const resetFilters = () => {
    setSearchText("");
    setSortDesc(false);
    setCurrentPage(1);
    setPageSize(10);
  };

  return (
    <main>
      <div>
        <button onClick={() => setIsAddModalOpen(true)}>
          ➕ Add New Category
        </button>

        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search categories..."
        />
        <SortSelector value={sortDesc} onChange={setSortDesc} />
        <ResetFilters onReset={resetFilters} />
      </div>

      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <React.Fragment key={category.id}>
              <tr>
                <td>
                  <span>{category.name}</span>
                </td>
                <td>
                  {editingCategoryId !== category.id && (
                    <div>
                      <button onClick={() => openEditModal(category)}>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={deletingCategoryId === category.id}
                      >
                        {deletingCategoryId === category.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                      <button
                        onClick={() =>
                          setExpandedCategoryId(
                            expandedCategoryId === category.id
                              ? null
                              : category.id
                          )
                        }
                      >
                        {expandedCategoryId === category.id
                          ? "Hide books"
                          : "View books"}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
              {expandedCategoryId === category.id && (
                <tr>
                  <td colSpan="2">
                    <BooksByCategory categoryId={category.id} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCategoryId(null);
        }}
        onSave={() => handleUpdate(editingCategoryId)}
        value={editingCategoryName}
        onChange={setEditingCategoryName}
        loading={editLoading}
        error={editError}
      />

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCategoryAdded={fetchCategories}
      />
    </main>
  );
}

export default CategoryList;
