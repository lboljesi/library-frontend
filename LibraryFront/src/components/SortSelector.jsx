function SortSelector({ value, onChange }) {
  return (
    <div>
      <label htmlFor="sort">Sort order</label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value === "true")}
      >
        <option value="false">Ascending (A → Z)</option>
        <option value="true">Descending (Z → A)</option>
      </select>
    </div>
  );
}

export default SortSelector;
