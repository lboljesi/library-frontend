import { useState } from "react";
import { deleteBookCategory } from "../services/api";

function BulkDeleteCategories({ bookCategories, onUpdate }) {
  const [selectedToDelete, setSelectedToDelete] = useState([]);
  const [deletingIds, setDeletingIds] = useState([]);
  const [error, setError] = useState(null);

  const handleCheckboxToggle = (relationId) => {
    setSelectedToDelete((prev) =>
      prev.includes(relationId)
        ? prev.filter((id) => id !== relationId)
        : [...prev, relationId]
    );
  };

  const handleBulkRemove = () => {
    if (
      selectedToDelete.length === 0 ||
      !window.confirm("Do you want to remove selected categories?")
    )
      return;

    setDeletingIds(selectedToDelete);

    Promise.all(selectedToDelete.map((id) => deleteBookCategory(id)))
      .then(() => {
        const updated = bookCategories.filter(
          (cat) => !selectedToDelete.includes(cat.bookCategoryRelationId)
        );
        onUpdate(updated);
        setSelectedToDelete([]);
      })
      .catch((err) => {
        console.error("Error during bulk delete", err);
        setError("Some deletions failed");
      })
      .finally(() => {
        setDeletingIds([]);
      });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">
        Select categories to remove:
      </h3>

      <ul className="space-y-1">
        {bookCategories.map((cat) => (
          <li key={cat.bookCategoryRelationId}>
            <label className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                className="accent-indigo-600"
                checked={selectedToDelete.includes(cat.bookCategoryRelationId)}
                onChange={() =>
                  handleCheckboxToggle(cat.bookCategoryRelationId)
                }
                disabled={deletingIds.includes(cat.bookCategoryRelationId)}
              />
              {cat.categoryName}
            </label>
          </li>
        ))}
      </ul>

      <button
        onClick={handleBulkRemove}
        disabled={selectedToDelete.length === 0 || deletingIds.length > 0}
        className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
          selectedToDelete.length === 0 || deletingIds.length > 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {deletingIds.length > 0 ? "Removing..." : "Remove Selected Categories"}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

export default BulkDeleteCategories;
