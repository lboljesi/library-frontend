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
    (cat) => !bookCategories.some((bc) => bc.categoryId === cat.id)
  );

  const handleAdd = () => {
    if (selectedIds.length === 0) return;

    setLoading(true);
    setError(null);

    addMultipleCategoriesToBook(bookId, selectedIds)
      .then((res) => {
        onUpdate([...bookCategories, ...res.data]);
        setSelectedIds([]);
      })
      .catch((err) => {
        console.error("Error adding categories", err);
        setError("Failed to add categories.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-4">
      {bookCategories.length === 0 ? (
        <p className="text-sm text-gray-500 italic">
          This book has no categories yet.
        </p>
      ) : (
        <BulkDeleteCategories
          bookCategories={bookCategories}
          onUpdate={onUpdate}
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Add Categories
        </label>
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
          className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 text-sm bg-white"
        >
          {avaibleCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAdd}
        disabled={loading || selectedIds.length === 0}
        className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
          loading || selectedIds.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Adding..." : "Add Selected Categories"}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
export default BulkAddCategoriesToBook;
