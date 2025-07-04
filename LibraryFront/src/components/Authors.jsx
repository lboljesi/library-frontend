import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const AuthorsCrud = () => {
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [sortBy, setSortBy] = useState("FirstName");
  const [sortDesc, setSortDesc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchAuthors();
  }, [
    searchFirstName,
    searchLastName,
    sortBy,
    sortDesc,
    currentPage,
    pageSize,
  ]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchAuthors = async () => {
    try {
      const params = {
        FirstName: searchFirstName || undefined,
        LastName: searchLastName || undefined,
        SortBy: sortBy,
        SortDesc: sortDesc,
        Page: currentPage,
        PageSize: pageSize,
      };
      const response = await axios.get("https://localhost:7184/api/Authors", {
        params,
      });
      setAuthors(response.data);
    } catch (error) {
      console.error("Failed to fetch authors", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get("https://localhost:7184/api/Books");
      setBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch books", error);
    }
  };

  const openModal = (author = null) => {
    if (author) {
      setEditingId(author.id);
      setFirstName(author.firstName);
      setLastName(author.lastName);
    } else {
      setEditingId(null);
      setFirstName("");
      setLastName("");
    }
    setSelectedBookId("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFirstName("");
    setLastName("");
    setSelectedBookId("");
    setEditingId(null);
  };

  const addOrUpdateAuthor = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert("First name and last name are required");
      return;
    }

    const authorData = {
      id: editingId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    };

    try {
      if (editingId) {
        await axios.put(
          `https://localhost:7184/api/Authors/${editingId}`,
          authorData
        );
      } else {
        const authorResponse = await axios.post(
          "https://localhost:7184/api/Authors",
          authorData
        );
        authorData.id = authorResponse.data.id;
      }

      if (selectedBookId) {
        await axios.post("https://localhost:7184/api/BookAuthors", {
          authorId: authorData.id,
          bookId: selectedBookId,
        });
      }

      fetchAuthors();
      closeModal();
    } catch (error) {
      if (error.response?.status === 409) {
        alert(
          `Author ${authorData.firstName} ${authorData.lastName} already exists.`
        );
      } else {
        console.error("Failed to add/update author", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7184/api/Authors/${id}`);
      fetchAuthors();
    } catch (error) {
      console.error("Failed to delete author", error);
    }
  };

  const handleReset = () => {
    setSearchFirstName("");
    setSearchLastName("");
    setSortBy("FirstName");
    setSortDesc(false);
    setCurrentPage(1);
    setPageSize(10);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(column);
      setSortDesc(false);
    }
    setCurrentPage(1);
  };

  const renderSortArrow = (column) => {
    if (sortBy !== column) return null;
    return sortDesc ? " ▼" : " ▲";
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Authors
      </h1>

      <button
        onClick={() => openModal()}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ➕ Add New Author
      </button>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by first name"
          value={searchFirstName}
          onChange={(e) => {
            setSearchFirstName(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full sm:w-auto"
        />
        <input
          type="text"
          placeholder="Search by last name"
          value={searchLastName}
          onChange={(e) => {
            setSearchLastName(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full sm:w-auto"
        />
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100"
        >
          Reset Filters
        </button>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center gap-4 mb-6">
        <label className="font-medium">Page Size:</label>
        <input
          type="number"
          value={pageSize}
          min="1"
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="px-2 py-1 border border-gray-300 rounded-md w-20"
        />
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 border rounded-md bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="font-medium">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 border rounded-md bg-gray-100"
        >
          Next
        </button>
      </div>

      {/* TABLE */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Authors Table
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                onClick={() => handleSort("FirstName")}
                className="px-4 py-2 text-left cursor-pointer"
              >
                First Name{renderSortArrow("FirstName")}
              </th>
              <th
                onClick={() => handleSort("LastName")}
                className="px-4 py-2 text-left cursor-pointer"
              >
                Last Name{renderSortArrow("LastName")}
              </th>
              <th className="px-4 py-2 text-left">Books</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {authors.map((author) => (
              <tr key={author.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-900">
                  {author.firstName}
                </td>
                <td className="px-4 py-2 text-gray-800">{author.lastName}</td>
                <td className="px-4 py-2 italic text-gray-500">
                  📚 {author.bookTitles || "No books"}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => openModal(author)}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(author.id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Author" : "Add Author"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">First Name</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Last Name</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Select Book</label>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">-- No Book --</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={addOrUpdateAuthor}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                {editingId ? "Update Author" : "Add Author"}
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded hover:bg-gray-100"
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

export default AuthorsCrud;
