function SortByAndOrderSelector({
  sortBy,
  desc,
  onSortByChange,
  onDescChange,
}) {
  return (
    <div>
      <label htmlFor="sortBy">Sort by</label>
      <select
        id="sortBy"
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
      >
        <option value="title">Title</option>
        <option value="year">Published year</option>
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
