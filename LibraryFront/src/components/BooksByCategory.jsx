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

  if (loading) return <p>Loading books...</p>;

  if (error) return <p>{error}</p>;

  if (books.length === 0) return <p>No books found in this category.</p>;

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>
          <strong>{book.title}</strong>
          <span>
            {book.publishedYear} · ISBN: {book.isbn}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default BooksByCategory;
