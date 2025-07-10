import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7184/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getBooksForCategory = (categoryId) =>
  api.get(`/bookcategory/${categoryId}/books`);

export const getBooksWithAuthorsForCategory = (categoryId) =>
  api.get(`/bookcategory/${categoryId}/books-with-authors`);

export const deleteRelationIds = (relationIds) =>
  api.post("/bookcategory/delete/by-relation-ids", { relationIds });

export function deleteCategory(id) {
  return api.delete(`/category/${id}`);
}

export function addCategory(name) {
  return api.post("/category", { name });
}

export function getBooksGroupedByCategory(params) {
  return api.get("/bookcategory/grouped-by-book", { params });
}

export function deleteBookCategory(id) {
  return api.delete(`/bookcategory/${id}`);
}

export function addCategoryToBook(bookId, categoryId) {
  return api.post("/bookcategory", { bookId, categoryId });
}

export function addMultipleCategoriesToBook(bookId, categoryIds) {
  return api.post("/bookcategory/bulk", { bookId, categoryIds });
}

export const fetchBooks = async () => {
  const response = await api.get("/Books");
  return response.data;
};

export function updateCategory(id, name) {
  return api.put(`/category/${id}`, { name });
}

export const getCategories = ({ desc, search, page, pageSize }) => {
  return api.get("/category", {
    params: {
      desc,
      search,
      page,
      pageSize,
    },
  });
};

export default api;
