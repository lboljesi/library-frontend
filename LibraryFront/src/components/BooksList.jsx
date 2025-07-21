function BooksList({ books, selectedBookIds, setSelectedBookIds }) {
  if (!books.length) return <p>No books found</p>;

  const toggleSelect = (id) => {
    if (selectedBookIds.includes(id))
      setSelectedBookIds((prev) => prev.filter((x) => x !== id));
    else setSelectedBookIds((prev) => [...prev, id]);
  };

  return (
    <ul>
      {books.map((book) => {
        console.log(book.id);
        return (
          <li key={book.id}>
            <input
              type="checkbox"
              checked={selectedBookIds.includes(book.id)}
              onChange={() => toggleSelect(book.id)}
            />
            <strong>{book.title}</strong> ({book.publishedYear}) <br />
            ISBN: {book.isbn} <br />
            Authors:{" "}
            {book.authors.length > 0
              ? book.authors
                  .map((a) => `${a.firstName} ${a.lastName}`)
                  .join(", ")
              : "No authors"}
            <br />
            Categories:{" "}
            {book.categories.length > 0
              ? book.categories.map((c) => c.name).join(", ")
              : "No categories"}
            <br />
          </li>
        );
      })}
    </ul>
  );
}

export default BooksList;
