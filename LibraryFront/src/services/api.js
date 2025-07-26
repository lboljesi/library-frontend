import axios from "axios";
import { UNSAFE_withErrorBoundaryProps } from "react-router-dom";

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
/*
export const fetchBooks = async () => {
  const response = await api.get("/books");
  return response.data;
};
*/
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

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

export async function loginRequest(email, password) {
  const response = await api.post("/auth/login", { email, password });
  return response.data.token;
}

export async function registerRequest(email, password, fullName) {
  const response = await api.post("/auth/register", {
    email,
    password,
    fullName,
  });
  return response.data.token;
}

export async function fetchBooksPaged(params) {
  const response = await api.get("/book/paged", { params });
  return response.data;
}
export async function addBook(book) {
  const response = await api.post("/book", book);
  return response.data;
}

export async function getAllCategories() {
  const response = await api.get("/category/all");
  return response.data;
}

export async function getAllAuthors() {
  const response = await api.get("/author/all");
  return response.data;
}

export async function deleteBook(id) {
  await api.delete(`/book/${id}`);
}

export async function deleteBooksBulk(ids) {
  await api.post("/book/delete/bulk", ids);
}

export async function updateBook(id, book) {
  const response = await api.put(`/book/${id}`, book);
  return response.data;
}

export async function fetchBookAuthors(bookId) {
  const res = await api.get(`/book/${bookId}/authors`);
  return res.data;
}
export async function fetchBookCategories(bookId) {
  const res = await api.get(`/book/${bookId}/categories`);
  return res.data;
}

export async function deleteBookAuthorLink(bookAuthorId) {
  await api.delete(`/book/bookauthor/${bookAuthorId}`);
}

export async function deleteBookCategoryLink(bookCategoryId) {
  await api.delete(`/book/bookcategory/${bookCategoryId}`);
}

export default api;
