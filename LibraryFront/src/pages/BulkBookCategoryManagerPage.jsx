import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api, { getBooksGroupedByCategory } from "../services/api";
import BulkAddCategoriesToBook from "../components/BulkAddCategoriesToBook";
import Pagination from "../components/Pagination";
import SortSelector from "../components/SortSelector";
import ResetFilters from "../components/ResetFilters";
import "../css/BulkBookCategoryManagerPage.css";
import SearchBar from "../components/SearchBar";

function BulkBookCategoryManagerPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearchTerm = searchParams.get("search") || "";
  const initialSortDesc = searchParams.get("desc") === "true";
  const initialPage = parseInt(searchParams.get("page") || "1");
  const initialPageSize = parseInt(searchParams.get("pageSize") || "5");

  const [books, setBooks] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState(initialSearchTerm);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [sortDesc, setSortDesc] = useState(initialSortDesc);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    setSearchParams({
      search: debouncedSearchTerm,
      desc: sortDesc.toString(),
      page: currentPage.toString(),
      pageSize: pageSize.toString(),
    });
  }, [debouncedSearchTerm, sortDesc, currentPage, pageSize, setSearchParams]);

  // First api
  const fetchData = () => {
    setLoading(true);
    Promise.all([
      getBooksGroupedByCategory({
        search: debouncedSearchTerm,
        desc: sortDesc,
        page: currentPage,
        pageSize: pageSize,
      }),
      api.get("/category/all"),
    ])
      .then(([booksRes, categoriesRes]) => {
        setBooks(booksRes.data.items || []);
        setTotalCount(booksRes.data.totalCount || 0);
        setAllCategories(categoriesRes.data.items || categoriesRes.data);
      })
      .catch((err) => console.error("Error loading data", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearchTerm, sortDesc, currentPage, pageSize]);

  const resetFilters = () => {
    setSearchTerm("");
    setSortDesc(false);
    setCurrentPage(1);
    setPageSize(5);
  };

  const updateSingleBook = (bookId, updatedCategories) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.bookId === bookId
          ? { ...book, categories: updatedCategories }
          : book
      )
    );
  };

  return (
    <div>
      <h1>Manage Book-Category Relations</h1>

      <div>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search books..."
        />

        <SortSelector
          value={sortDesc}
          onChange={(val) => {
            setSortDesc(val);
            setCurrentPage(1);
          }}
        />

        <ResetFilters onReset={resetFilters} />
      </div>

      {loading ? (
        <p>Loading books and categories...</p>
      ) : (
        <div>
          {books.map((book) => (
            <div key={book.bookId}>
              <h3>{book.bookTitle}</h3>
              <BulkAddCategoriesToBook
                bookId={book.bookId}
                allCategories={allCategories}
                bookCategories={book.categories}
                onUpdate={(updated) => updateSingleBook(book.bookId, updated)}
              />
            </div>
          ))}
        </div>
      )}

      <div>
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
}
export default BulkBookCategoryManagerPage;
