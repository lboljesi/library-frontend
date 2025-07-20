function BooksList({ books }) {
  if (!books.length) return <p>No books found</p>;
  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>
          <strong>{book.title}</strong> ({book.publishedYear}) <br />
          ISBN: {book.isbn} <br />
          Authors:{" "}
          {book.authors.length > 0
            ? book.authors.map((a) => `${a.firstName} ${a.lastName}`).join(", ")
            : "No authors"}
          <br />
          Categories:{" "}
          {book.categories.length > 0
            ? book.categories.map((c) => c.name).join(", ")
            : "No categories"}
        </li>
      ))}
    </ul>
  );
}
export default BooksList;
