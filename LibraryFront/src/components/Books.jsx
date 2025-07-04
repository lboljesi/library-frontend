import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import Select from "react-select";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [sortBy, setSortBy] = useState("Title");
  const [sortDesc, setSortDesc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Filters state
  const [filterTitle, setFilterTitle] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [filterPublishedYear, setFilterPublishedYear] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [price, setPrice] = useState("");
  const [selectedAuthorId, setSelectedAuthorId] = useState("");

  const fetchBooks = async () => {
    try {
      const params = {
        SortBy: sortBy,
        SortDesc: sortDesc,
        Page: currentPage,
        PageSize: pageSize,
      };
      const response = await axios.get("https://localhost:7184/api/Books", {
        params,
      });
      setBooks(response.data);
    } catch (error) {
      console.error("No books found", error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await axios.get("https://localhost:7184/api/Authors");
      setAuthors(response.data);
    } catch (error) {
      console.error("No authors found", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [sortBy, sortDesc, currentPage, pageSize]);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const openModal = () => {
    setTitle("");
    setIsbn("");
    setPublishedYear("");
    setPrice("");
    setSelectedAuthorId("");
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(
        `https://localhost:7184/api/Books/${id}`
      );
      const book = response.data;
      if (book) {
        setTitle(book.title);
        setIsbn(book.isbn);
        setPublishedYear(book.publishedYear.toString());
        setPrice(book.price.toString());
        setEditingId(book.id);
        setShowModal(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7184/api/Books/${id}`);
      await fetchBooks();
    } catch (error) {
      console.error(error);
    }
  };

  const addOrUpdateBook = async () => {
    if (!title.trim() || !isbn.trim()) {
      alert("Title and ISBN are required");
      return;
    }

    const bookData = {
      id: editingId,
      title: title.trim(),
      isbn: isbn.trim(),
      publishedYear: parseInt(publishedYear),
      price: parseInt(price),
    };

    try {
      let createdBookId = editingId;
      if (editingId) {
        await axios.put(
          `https://localhost:7184/api/Books/${editingId}`,
          bookData
        );
      } else {
        const res = await axios.post(
          "https://localhost:7184/api/Books",
          bookData
        );
        createdBookId = res.data.id;
      }

      if (selectedAuthorId) {
        await axios.post("https://localhost:7184/api/BookAuthors", {
          bookId: createdBookId,
          authorId: selectedAuthorId,
        });
      }

      await fetchBooks();
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save book");
    }
  };

  // Toggle sorting on column header click
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(column);
      setSortDesc(false);
    }
    setCurrentPage(1);
  };

  // Apply filters to the current page's books
  const filteredBooks = books.filter((b) => {
    const matchesTitle = b.title
      .toLowerCase()
      .includes(filterTitle.toLowerCase());
    const matchesPrice =
      filterPrice === "" || b.price === parseInt(filterPrice);
    const matchesYear =
      filterPublishedYear === "" ||
      b.publishedYear === parseInt(filterPublishedYear);

    return matchesTitle && matchesPrice && matchesYear;
  });

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Books Management
      </h1>

      <button
        onClick={openModal}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
      >
        ➕ Add New Book
      </button>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          value={filterTitle}
          onChange={(e) => setFilterTitle(e.target.value)}
          placeholder="Search by title"
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
          placeholder="Exact price"
          min="0"
          step="0.01"
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        <input
          type="number"
          value={filterPublishedYear}
          onChange={(e) => setFilterPublishedYear(e.target.value)}
          placeholder="Exact year"
          min="0"
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <button
        onClick={() => {
          setFilterTitle("");
          setFilterPrice("");
          setFilterPublishedYear("");
        }}
        className="mb-6 px-4 py-2 border border-gray-300 rounded-md bg-white shadow-sm hover:bg-gray-100"
      >
        Reset Filters
      </button>

      {/* Pagination */}
      <div className="flex items-center gap-4 mb-6">
        <label className="font-medium">Page Size:</label>
        <input
          type="number"
          value={pageSize}
          onChange={(e) => {
            const newSize = Number(e.target.value);
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          min="1"
          className="w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm"
        />
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Next
        </button>
      </div>

      {/* Table */}
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Books Table</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-md text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="px-3 py-2 cursor-pointer"
                onClick={() => handleSort("Title")}
              >
                Title {sortBy === "Title" && (sortDesc ? "▼" : "▲")}
              </th>
              <th
                className="px-3 py-2 cursor-pointer"
                onClick={() => handleSort("ISBN")}
              >
                ISBN {sortBy === "ISBN" && (sortDesc ? "▼" : "▲")}
              </th>
              <th
                className="px-3 py-2 cursor-pointer"
                onClick={() => handleSort("PublishedYear")}
              >
                Published Year{" "}
                {sortBy === "PublishedYear" && (sortDesc ? "▼" : "▲")}
              </th>
              <th
                className="px-3 py-2 cursor-pointer"
                onClick={() => handleSort("Price")}
              >
                Price {sortBy === "Price" && (sortDesc ? "▼" : "▲")}
              </th>
              <th className="px-3 py-2">Book Authors</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {b.title}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{b.isbn}</td>
                  <td className="px-4 py-3 text-right text-gray-700 font-medium">
                    {b.publishedYear}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700 font-medium">
                    {b.price}
                  </td>
                  <td className="px-4 py-3 italic text-gray-500 flex items-center gap-2">
                    <span>🧑</span>
                    <span
                      className={
                        b.bookAuthors
                          ? "text-gray-700 font-medium italic"
                          : "text-gray-400"
                      }
                    >
                      {b.bookAuthors || "Not a public information!"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap space-x-3">
                    <button
                      onClick={() => handleEdit(b.id)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-500 italic"
                >
                  No books found with current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Update Book" : "Add New Book"}
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="ISBN"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                value={publishedYear}
                onChange={(e) => setPublishedYear(e.target.value)}
                placeholder="Published Year"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <select
                value={selectedAuthorId}
                onChange={(e) => setSelectedAuthorId(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">-- Select Author --</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.firstName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={addOrUpdateBook}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                {editingId ? "Update" : "Add"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
