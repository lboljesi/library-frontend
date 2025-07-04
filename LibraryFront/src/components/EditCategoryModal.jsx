function EditCategoryModal({
  isOpen,
  onClose,
  onSave,
  value,
  onChange,
  loading,
  error,
}) {
  if (!isOpen) return null;

  return (
    <div>
      <div>
        <h2>Edit Category</h2>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div>
          <button onClick={onClose}>Cancel</button>
          <button onClick={onSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

export default EditCategoryModal;
