import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { deleteBooksBulk, fetchBooksPaged } from "../services/api";
import SearchBar from "../components/SearchBar";
import SortByAndOrderSelector from "../components/SortByAndOrderSelector";
import Pagination from "../components/Pagination";
import ResetFilters from "../components/ResetFilters";
import BooksList from "../components/BooksList";

import AddBookModal from "../components/AddBookModal";

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedBookIds, setSelectedBookIds] = useState([]);

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

  const handleBookAdded = (newBook) => {
    setBooks((prev) => [newBook, ...prev]);
    setTotalCount((prev) => prev + 1);
  };

  const handleBulkDelete = async () => {
    try {
      await deleteBooksBulk(selectedBookIds);
      setBooks((prev) =>
        prev.filter((book) => !selectedBookIds.includes(book.id))
      );
      setTotalCount((prev) => prev - selectedBookIds.length);
      setSelectedBookIds([]);
    } catch (err) {
      console.error("Bulk delete failed", err);
      alert("Failed to delete book.");
    }
  };

  return (
    <div>
      <h2>Books</h2>
      <button onClick={() => setIsModalOpen(true)}>Add New Book</button>
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
      {selectedBookIds.length > 0 && (
        <button onClick={handleBulkDelete}>
          Delete Selected ({selectedBookIds.length})
        </button>
      )}
      <p>Total: {totalCount}</p>
      {loading ? (
        <p>Loading books...</p>
      ) : (
        <BooksList
          books={books}
          selectedBookIds={selectedBookIds}
          setSelectedBookIds={setSelectedBookIds}
        />
      )}
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
      <AddBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookAdded={handleBookAdded}
      />
    </div>
  );
}
export default BooksPage;
