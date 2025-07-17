import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchBooksPaged } from "../services/api";
import SearchBar from "../components/SearchBar";

function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialSortBy = searchParams.get("sortBy") || "title";
  const initialDesc = searchParams.get("desc") === "true";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialPageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const [books, setBooks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [desc, setDesc] = useState(initialDesc);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    setSearchParams({
      search,
      sortBy,
      desc: desc.toString(),
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
  }, [search, sortBy, desc, page, pageSize, setSearchParams]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooksPaged({
          search,
          sortBy,
          desc,
          page,
          pageSize,
        });
        setBooks(data.books);
        setTotalCount(data.totalCount);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      }
    };
    loadBooks();
  }, [search, sortBy, desc, page, pageSize]);

  return (
    <div>
      <h2>Books</h2>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by title or ISBN"
      />
      <p>Total: {totalCount}</p>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> ({book.publishedYear}) <br />
            ISBN: {book.isbn} <br />
            Authors:{" "}
            {book.authors.map((a) => `${a.firstName} ${a.lastName}`).join(", ")}
            <br />
            Categories: {book.categories.map((c) => c.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default BooksPage;
