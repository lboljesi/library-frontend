import { useState } from "react";
import {
  addMultipleCategoriesToBook,
  deleteBookCategory,
} from "../services/api";
import BulkDeleteCategories from "./BulkDeleteCategories";

function BulkAddCategoriesToBook({
  bookId,
  allCategories,
  bookCategories,
  onUpdate,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const avaibleCategories = allCategories.filter(
    (cat) => !bookCategories.some((bc) => bc.id === cat.id)
  );

  const handleAdd = async () => {
    if (selectedIds.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const added = await addMultipleCategoriesToBook(bookId, selectedIds);
      onUpdate([...bookCategories, ...added]);
      setSelectedIds([]);
    } catch (err) {
      console.error("Error adding categories", err);
      setError("Failed to add categories");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {bookCategories.length === 0 ? (
        <p>This book has no categories yet.</p>
      ) : (
        <BulkDeleteCategories
          bookCategories={bookCategories}
          onUpdate={onUpdate}
        />
      )}

      <div>
        <h3>Add Categories</h3>
        <div>
          <select
            multiple
            size={Math.min(avaibleCategories.length, 6)}
            value={selectedIds}
            onChange={(e) =>
              setSelectedIds(
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
            disabled={avaibleCategories.length === 0}
          >
            {avaibleCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={loading || selectedIds.length === 0}
      >
        {loading ? "Adding..." : "Add Selected Categories"}
      </button>

      {error && <p>{error}</p>}
    </div>
  );
}
export default BulkAddCategoriesToBook;
