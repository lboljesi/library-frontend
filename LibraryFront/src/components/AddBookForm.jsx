import { useEffect, useState } from "react";
import { addBook, getAllAuthors, getAllCategories } from "../services/api";

function AddBookForm({ onBookAdded }) {
  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [price, setPrice] = useState("");
  const [authorIds, setAuthorIds] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, authorsData] = await Promise.all([
          getAllCategories(),
          getAllAuthors(),
        ]);
        setCategories(categoriesData);
        setAuthors(authorsData);
      } catch (err) {
        console.error("Failed to load authors / categories", err);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const newBook = {
        title,
        isbn,
        publishedYear: parseInt(publishedYear),
        price: price ? parseFloat(price) : null,
        authorIds,
        categoryIds,
      };
      const created = await addBook(newBook);
      onBookAdded(created);
    } catch (err) {
      console.error("Add failed:", err);
      setError(err.response?.data || "Failed to add book");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Book</h3>
      {error && <p>{error}</p>}
      <div>
        <label>Title: </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>ISBN: </label>
        <input
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Published Year: </label>
        <input
          type="number"
          value={publishedYear}
          onChange={(e) => setPublishedYear(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Price: </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div>
        <label>Authors: </label>
        <select
          multiple
          value={authorIds}
          onChange={(e) =>
            setAuthorIds(
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
        >
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.firstName} {a.lastName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Categories: </label>
        <select
          multiple
          value={categoryIds}
          onChange={(e) =>
            setCategoryIds(
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Add Book</button>
    </form>
  );
}
export default AddBookForm;
