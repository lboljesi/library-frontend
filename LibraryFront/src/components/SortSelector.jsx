function SortSelector({ value, onChange }) {
  return (
    <div className="flex flex-col gap-1 max-w-xs">
      <label
        htmlFor="sort"
        className="text-base font-semibold text-gray-800 tracking-tight"
      >
        Sort order
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value === "true")}
        className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
      >
        <option value="false">Ascending (A → Z)</option>
        <option value="true">Descending (Z → A)</option>
      </select>
    </div>
  );
}

export default SortSelector;
