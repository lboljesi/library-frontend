import { useEffect, useState } from "react";
import {
  addMultipleAuthorsToBook,
  addMultipleCategoriesToBook,
  deleteBookAuthorLink,
  deleteBookCategoryLink,
  fetchBookAuthors,
  fetchBookCategories,
  getAllAuthors,
  getAllCategories,
  updateBook,
} from "../services/api";
import { toast } from "react-toastify";

function EditBookModal({ book, isOpen, onClose, onBookEdited }) {
  const [form, setForm] = useState({
    title: "",
    isbn: "",
    publishedYear: "",
    price: "",
  });
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  useEffect(() => {
    if (!book) return;

    const fetchData = async () => {
      setForm({
        title: book.title || "",
        isbn: book.isbn || "",
        publishedYear: book.publishedYear?.toString() || "",
        price: book.price != null ? book.price.toString() : "",
      });

      try {
        const [authorsData, categoriesData, allAuth, allCateg] =
          await Promise.all([
            fetchBookAuthors(book.id),
            fetchBookCategories(book.id),
            getAllAuthors(),
            getAllCategories(),
          ]);
        setAuthors(authorsData);
        setCategories(categoriesData);
        setAllAuthors(allAuth);
        setAllCategories(allCateg);
      } catch (err) {
        console.error("Failed to fetch book data", err);
      }
    };

    fetchData();
  }, [book?.id, isOpen]);

  useEffect(() => {
    if (!isOpen) setSelectedAuthorIds([]);
  }, [isOpen]);

  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedBook = {
        title: form.title,
        isbn: form.isbn,
        publishedYear: form.publishedYear ? parseInt(form.publishedYear) : null,
        price: form.price !== "" ? parseInt(form.price) : null,
      };
      await updateBook(book.id, updatedBook);
      onBookEdited({ id: book.id, ...updatedBook });
      onClose();
    } catch (err) {
      alert("Failed to update book.");
    }
  };

  const handleDeleteAuthor = async (bookAuthorId) => {
    try {
      await deleteBookAuthorLink(bookAuthorId);
      setAuthors((prev) => {
        const next = prev.filter((a) => a.bookAuthorId !== bookAuthorId);
        onBookEdited({ id: book.id, authors: next });
        return next;
      });
      toast.success("Author removed");
    } catch (err) {
      toast.error("Failed to delete author!");
    }
  };

  const handleAddAuthors = async () => {
    if (selectedAuthorIds.length === 0) return;

    try {
      const newAuthors = await addMultipleAuthorsToBook(
        book.id,
        selectedAuthorIds
      );
      if (Array.isArray(newAuthors) && newAuthors.length > 0) {
        setAuthors((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const toAdd = newAuthors.filter((a) => !existingIds.has(a.id));
          const next = [...prev, ...toAdd];
          onBookEdited({ id: book.id, authors: next });
          return next;
        });
        setSelectedAuthorIds([]);
        const skipped = selectedAuthorIds.length - newAuthors.length;
        if (skipped > 0) {
          toast.info(
            `Added ${newAuthors.length}, skipped ${skipped} (already linked)`
          );
        } else {
          toast.success(`Added ${newAuthors.length} author(s).`);
        }
      } else {
        toast.info("No authors added (all were already linked?)");
      }
    } catch (err) {
      toast.error("Failed to add authors");
    }
  };

  const handleAddCategories = async () => {
    if (selectedCategoryIds.length === 0) return;

    try {
      const added = await addMultipleCategoriesToBook(
        book.id,
        selectedCategoryIds
      );
      if (Array.isArray(added) && added.length > 0) {
        setCategories((prev) => {
          const existing = new Set(prev.map((c) => c.id));
          const toAdd = added.filter((c) => !existing.has(c.id));
          const next = [...prev, ...toAdd];
          onBookEdited({ id: book.id, categories: next });
          return next;
        });
        setSelectedCategoryIds([]);
        toast.success(`Added ${added.length} categories.`);
      } else {
        toast.info("No categories added (already linked?)");
      }
    } catch (err) {
      toast.error("Failed to add categories.");
    }
  };

  const handleDeleteCategory = async (bookCategoryId) => {
    try {
      await deleteBookCategoryLink(bookCategoryId);
      setCategories((prev) => {
        const next = prev.filter((c) => c.bookCategoryId !== bookCategoryId);
        onBookEdited({ id: book.id, categories: next }); // da se vidi i u listi
        return next;
      });
      toast.success("Category removed");
    } catch (err) {
      toast.error("Failed to delete category!");
    }
  };

  if (!isOpen || !book) return null;

  return (
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

      <div>
        <label>Add Authors</label>
        <select
          multiple
          value={selectedAuthorIds}
          onChange={(e) =>
            setSelectedAuthorIds(
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
        >
          {allAuthors
            .filter((a) => !authors.some((auth) => auth.id === a.id))
            .map((a) => (
              <option key={a.id} value={a.id}>
                {a.firstName} {a.lastName}
              </option>
            ))}
        </select>
        <button onClick={handleAddAuthors}>Add Selected Authors</button>
      </div>

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
      <div>
        <label>Add Categories</label>
        <select
          multiple
          value={selectedCategoryIds}
          onChange={(e) =>
            setSelectedCategoryIds(
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
        >
          {allCategories
            .filter((cat) => !categories.some((c) => c.id === cat.id))
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
        <button onClick={handleAddCategories}>Add Selected Categories</button>
      </div>
      <button onClick={onClose}>Exit</button>
    </div>
  );
}
export default EditBookModal;
