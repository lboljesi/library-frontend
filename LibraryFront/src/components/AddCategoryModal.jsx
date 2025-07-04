import { useState } from "react";
import api, { addCategory } from "../services/api";

function AddCategoryModal({ isOpen, onClose, onCategoryAdded }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setError("");
    setLoading(true);

    addCategory(name)
      .then(() => {
        setName("");
        onCategoryAdded?.();
        onClose(); // zatvori modal
      })
      .catch((err) => {
        console.error("Error adding category:", err);
        if (err.response?.status === 409)
          setError("A category with this name already exists.");
        else setError("Something went wrong while adding category.");
      })
      .finally(() => setLoading(false));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Add New Category
        </h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          disabled={loading}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:bg-gray-100"
        />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
      </form>
    </div>
  );
}

export default AddCategoryModal;
