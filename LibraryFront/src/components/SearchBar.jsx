function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="max-w-md w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition"
      />
    </div>
  );
}

export default SearchBar;
