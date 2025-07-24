import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { deleteBooksBulk, fetchBooksPaged } from "../services/api";
import SearchBar from "../components/SearchBar";
import SortByAndOrderSelector from "../components/SortByAndOrderSelector";
import Pagination from "../components/Pagination";
import ResetFilters from "../components/ResetFilters";
import BooksList from "../components/BooksList";
import { toast, ToastContainer } from "react-toastify";
import AddBookModal from "../components/AddBookModal";
import EditBookModal from "../components/EditBookModal";

function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialSortBy = searchParams.get("sortBy") || "title";
  const initialDesc = searchParams.get("desc") === "true";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialPageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const initialPublishedYear = searchParams.get("publishedYear") || "";

  const [books, setBooks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [desc, setDesc] = useState(initialDesc);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [publishedYear, setPublishedYear] = useState(initialPublishedYear);
  const [draftPublishedYear, setDraftPublishedYear] = useState(publishedYear);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookIds, setSelectedBookIds] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const checkboxRef = useRef();

  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    setSearchParams({
      search,
      sortBy,
      desc: desc.toString(),
      page: page.toString(),
      pageSize: pageSize.toString(),
      publishedYear,
    });
  }, [search, sortBy, desc, page, pageSize, publishedYear, setSearchParams]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    if (!checkboxRef.current) return;
    const allIds = books.map((b) => b.id);
    const allSelected = allIds.every((id) => selectedBookIds.includes(id));
    const noneSelected = allIds.every((id) => !selectedBookIds.includes(id));
    checkboxRef.current.indeterminate = !allSelected && !noneSelected;
  }, [books, selectedBookIds]);

  const handleSelectAll = (e) => {
    const allIds = books.map((b) => b.id);
    if (e.target.checked) {
      const newSelected = Array.from(new Set([...selectedBookIds, ...allIds]));
      setSelectedBookIds(newSelected);
    } else {
      const newSelected = selectedBookIds.filter((id) => !allIds.includes(id));
      setSelectedBookIds(newSelected);
    }
  };

  useEffect(() => {
    setSelectedBookIds((prevSelected) =>
      prevSelected.filter((id) => books.some((b) => b.id === id))
    );
  }, [books]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await fetchBooksPaged({
        search: debouncedSearch,
        sortBy,
        desc,
        page,
        pageSize,
        publishedYear,
      });
      setBooks(data.books);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      toast.error("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [debouncedSearch, sortBy, desc, page, pageSize, publishedYear]);

  const handleBookAdded = () => {
    loadBooks();
    toast.success("Book added successfully!");
  };

  const handleBulkDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedBookIds.length} book(s)?`
    );
    if (!confirmed) {
      return;
    }
    setDeleting(true);
    try {
      await deleteBooksBulk(selectedBookIds);

      if (books.length === selectedBookIds.length && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await loadBooks();
      }
      setSelectedBookIds([]);
      toast.success("Books deleted successfully!");
    } catch (err) {
      console.error("Bulk delete failed", err);
      toast.error("Failed to delete selected books.");
    } finally {
      setDeleting(false);
    }
  };

  const handlePublishedYearKeyDown = (e) => {
    if (e.key === "Enter") {
      setPublishedYear(draftPublishedYear);
      setPage(1);
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
      <input
        type="number"
        value={draftPublishedYear}
        onChange={(e) => {
          setDraftPublishedYear(e.target.value);
        }}
        placeholder="Filter by published year"
        onKeyDown={handlePublishedYearKeyDown}
      />
      <button
        onClick={() => {
          setPublishedYear(draftPublishedYear);
          setPage(1);
        }}
      >
        Apply
      </button>
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
          setPublishedYear("");
          setDraftPublishedYear("");
        }}
      />
      {selectedBookIds.length > 0 && (
        <button
          type="button"
          onClick={handleBulkDelete}
          disabled={loading || deleting}
        >
          Delete Selected ({selectedBookIds.length})
        </button>
      )}
      <label>
        <input
          type="checkbox"
          ref={checkboxRef}
          checked={
            books.length > 0 &&
            books.every((b) => selectedBookIds.includes(b.id))
          }
          onChange={handleSelectAll}
        />
        Select all on page
      </label>
      <p>Total: {totalCount}</p>
      {loading ? (
        <p>Loading books...</p>
      ) : (
        <BooksList
          books={books}
          selectedBookIds={selectedBookIds}
          setSelectedBookIds={setSelectedBookIds}
          onEdit={(book) => setEditingBook(book)}
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
      <EditBookModal
        isOpen={!!editingBook}
        book={editingBook}
        onClose={() => setEditingBook(null)}
        onBookEdited={loadBooks}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
export default BooksPage;
