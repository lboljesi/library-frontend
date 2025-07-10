import { useState, useEffect } from "react";
import { deleteRelationIds } from "../services/api";

function BulkDeleteCategories({ bookCategories, onUpdate }) {
  const [selectedToDelete, setSelectedToDelete] = useState([]);
  const [deletingIds, setDeletingIds] = useState([]);
  const [error, setError] = useState(null);

  /*
  const handleCheckboxToggle = (relationId) => {
    setSelectedToDelete((prev) =>
      prev.includes(relationId)
        ? prev.filter((id) => id !== relationId)
        : [...prev, relationId]
    );
  };
  */

  const handleCheckboxToggle = (relationId) => {
    setSelectedToDelete((prev) => {
      if (prev.includes(relationId))
        return prev.filter((id) => id !== relationId);
      else return [...prev, relationId];
    });
  };

  const handleBulkRemove = () => {
    if (
      selectedToDelete.length === 0 ||
      !window.confirm("Do you want to remove selected categories?")
    )
      return;

    setDeletingIds(selectedToDelete);

    deleteRelationIds(selectedToDelete)
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
    <div>
      <h3>Select categories to remove:</h3>
      <ul>
        {bookCategories.map((cat) => (
          <li key={cat.bookCategoryRelationId}>
            <label>
              <input
                type="checkbox"
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
      >
        {deletingIds.length > 0 ? "Removing..." : "Remove Selected Categories"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default BulkDeleteCategories;
