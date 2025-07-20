import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchBooksPaged } from "../services/api";
import SearchBar from "../components/SearchBar";
import SortByAndOrderSelector from "../components/SortByAndOrderSelector";
import Pagination from "../components/Pagination";
import ResetFilters from "../components/ResetFilters";
import BooksList from "../components/BooksList";

function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialSortBy = searchParams.get("sortBy") || "title";
  const initialDesc = searchParams.get("desc") === "true";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialPageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const [books, setBooks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [desc, setDesc] = useState(initialDesc);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

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
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
        const data = await fetchBooksPaged({
          search: debouncedSearch,
          sortBy,
          desc,
          page,
          pageSize,
        });
        setBooks(data.books);
        setTotalCount(data.totalCount);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [debouncedSearch, sortBy, desc, page, pageSize]);

  return (
    <div>
      <h2>Books</h2>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by title or ISBN"
      />
      <SortByAndOrderSelector
        sortBy={sortBy}
        desc={desc}
        onSortByChange={(val) => {
          setSortBy(val);
          setPage(1);
        }}
        onDescChange={(val) => {
          setDesc(val);
          setPage(1);
        }}
      />
      <ResetFilters
        onReset={() => {
          setSearch("");
          setSortBy("title");
          setDesc(false);
          setPage(1);
          setPageSize(10);
        }}
      />
      <p>Total: {totalCount}</p>
      {loading ? <p>Loading books...</p> : <BooksList books={books} />}
      <Pagination
        currentPage={page}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
      />
    </div>
  );
}
export default BooksPage;
