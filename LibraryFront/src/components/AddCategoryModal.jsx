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
        onClose();
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
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Add New Category</h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          disabled={loading}
        />

        <div>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </button>
        </div>

        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default AddCategoryModal;
