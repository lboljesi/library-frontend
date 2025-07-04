import { useEffect, useState } from "react";
import { getBooksForCategory } from "../services/api";

function BooksByCategory({ categoryId }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) return;

    setLoading(true);
    setError(null);

    getBooksForCategory(categoryId)
      .then((response) => setBooks(response.data))
      .catch((err) => {
        console.error("Error fetching books", err);
        setError("Failed to load books.");
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) return <p className="text-sm text-gray-500">Loading books...</p>;

  if (error) return <p className="text-sm text-red-600 font-medium">{error}</p>;

  if (books.length === 0)
    return (
      <p className="ml-6 mb-4 text-base text-red-500 italic font-semibold">
        No books found in this category.
      </p>
    );

  return (
    <ul className="ml-4 border-l-4 border-blue-200 pl-4 space-y-3 text-sm text-gray-800">
      {books.map((book) => (
        <li
          key={book.id}
          className="p-3 rounded-md bg-gray-50 shadow-sm border border-gray-200"
        >
          <strong className="block text-gray-900 text-base">
            {book.title}
          </strong>
          <span className="text-gray-600">
            {book.publishedYear} &middot; ISBN: {book.isbn}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default BooksByCategory;
