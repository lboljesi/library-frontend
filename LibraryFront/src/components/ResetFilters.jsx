function ResetFilters({ onReset }) {
  return (
    <button
      onClick={onReset}
      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow hover:bg-gray-100 transition"
    >
      Reset filters
    </button>
  );
}

export default ResetFilters;
