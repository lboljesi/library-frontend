import { useEffect, useState } from "react";
import {
  deleteBookAuthorLink,
  deleteBookCategoryLink,
  fetchBookAuthors,
  fetchBookCategories,
  updateBook,
} from "../services/api";

function EditBookModal({ book, isOpen, onClose, onBookEdited }) {
  const [form, setForm] = useState({
    title: "",
    isbn: "",
    publishedYear: "",
    price: "",
  });
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!book) return;

    setForm({
      title: book.title || "",
      isbn: book.isbn || "",
      publishedYear: book.publishedYear?.toString() || "",
      price: book.price != null ? book.price.toString() : "",
    });

    const fetchRelations = async () => {
      try {
        const [authorsData, categoriesData] = await Promise.all([
          fetchBookAuthors(book.id),
          fetchBookCategories(book.id),
        ]);
        setAuthors(authorsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to fetch authors/categories", err);
      }
    };
    fetchRelations();
  }, [book]);

  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateBook(book.id, {
        title: form.title,
        isbn: form.isbn,
        publishedYear: form.publishedYear ? parseInt(form.publishedYear) : null,
        price: form.price !== "" ? parseInt(form.price) : null,
      });
      onBookEdited();
      onClose();
    } catch (err) {
      alert("Failed to update book.");
    }
  };

  const handleDeleteAuthor = async (bookAuthorId) => {
    try {
      await deleteBookAuthorLink(bookAuthorId);
      const refreshed = await fetchBookAuthors(book.id);
      setAuthors(refreshed);
    } catch (err) {
      toast.error("Failed to delete author!");
    }
  };

  const handleDeleteCategory = async (bookCategoryId) => {
    try {
      await deleteBookCategoryLink(bookCategoryId);
      const refreshed = await fetchBookCategories(book.id);
      setCategories(refreshed);
    } catch (err) {
      toast.error("Failed to delete category!");
    }
  };

  if (!isOpen || !book) return null;

  return (
    <div>
      <div>
        <h2>Edit Book</h2>
        <input
          value={form.title}
          onChange={(e) => updateForm("title", e.target.value)}
          placeholder="Title"
        />
        <input
          value={form.isbn}
          onChange={(e) => updateForm("isbn", e.target.value)}
          placeholder="ISBN"
        />
        <input
          type="number"
          value={form.publishedYear}
          onChange={(e) => updateForm("publishedYear", e.target.value)}
          placeholder="Published Year"
        />
        <input
          type="number"
          value={form.price}
          onChange={(e) => updateForm("price", e.target.value)}
          placeholder="Price"
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
        <h4>Authors</h4>
        <ul>
          {authors.length === 0 ? (
            <li>No authors</li>
          ) : (
            authors.map((a) => (
              <li key={a.id}>
                {a.firstName} {a.lastName}
                <button onClick={() => handleDeleteAuthor(a.bookAuthorId)}>
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
        <h4>Categories</h4>
        <ul>
          {categories.length === 0 ? (
            <li>No categories</li>
          ) : (
            categories.map((c) => (
              <li key={c.id}>
                {c.name}
                <button onClick={() => handleDeleteCategory(c.bookCategoryId)}>
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
export default EditBookModal;
