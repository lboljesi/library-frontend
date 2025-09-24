function SortByAndOrderSelector({
  sortBy,
  desc,
  onSortByChange,
  onDescChange,
  options = [
    { value: "title", label: "Title" },
    { value: "year", label: "Published year" },
  ],
}) {
  return (
    <div>
      <label htmlFor="sortBy">Sort by</label>
      <select
        id="sortBy"
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <label htmlFor="order">Order</label>
      <select
        id="order"
        value={desc.toString()}
        onChange={(e) => onDescChange(e.target.value === "true")}
      >
        <option value="false">Ascending (A → Z)</option>
        <option value="true">Descending (Z → A)</option>
      </select>
    </div>
  );
}
export default SortByAndOrderSelector;
