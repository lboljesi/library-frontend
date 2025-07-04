import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7184/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getBooksForCategory = (categoryId) =>
  api.get(`/bookcategory/${categoryId}/books`);

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

export const getAllLoans = async ({
  page = 1,
  pageSize = 10,
  sortBy = "LoanDate",
  sortDirection = "asc",
  isReturned = null,
  search = null,
} = {}) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("pageSize", pageSize);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortDirection) params.append("sortDirection", sortDirection);
    if (isReturned !== null) params.append("isReturned", isReturned); // true/false
    if (search) params.append("search", search);

    const response = await api.get(`/Loan?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching loans: ", error);
    throw error;
  }
};

export const deleteLoan = async (id) => {
  try {
    const response = await api.delete(`/Loan/${id}`); 
    return response.data;
  } catch (error) {
    console.error("Error deleting loan: ", error);
    throw error;
  }
};

export const updateLoan = async (id, updatedLoan) => {
  try {
    const response = await api.put(`/Loan/${id}`, updatedLoan);
    return response.data;
  } catch (error) {
    console.error("Error updating loan: ", error);
    throw error;
  }
};

export const addLoan = async (loanData) => {
  try {
    const response = await api.post(`/Loan`, loanData);
    return response.data;
  } catch (error) {
    console.error("Error adding loan; ", error);
    throw error;
  }
};

export const fetchBooks = async () => {
  const response = await api.get("/Books");
  return response.data;
};
export const fetchMembers = async ({
  page = 1,
  pageSize = 10,
  search = "",
  sortBy = "Name",
  sortDirection = "asc",
} = {}) => {
  try {
    const params = {
      Search: search || undefined,
      SortBy: sortBy,
      SortDirection: sortDirection,
      Page: page,
      PageSize: pageSize,
    };

    const response = await api.get("/members", { params });
    return response.data;
  } catch (err) {
    console.error("Greška prilikom dohvaćanja članova:", err);
    throw err;
  }
};


export function updateCategory(id, name) {
  return api.put(`/category/${id}`, { name });
}

export function getEmptyCategories() {
  return api.get("/bookcategory/empty");
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

export const deleteMember = async (id) => {
  const response = await api.delete(`/members/${id}`);
  return response.data;
};

export const getMemberById = async (id) => {
  const response = await api.get(`/members/${id}`);
  return response.data;
}

export const updateMember = async (id, updatedMember) => {
  const response = await api.put(`/members/${id}`, updatedMember); 
  return response.data;
}

export const createMember = (member) =>{
  return api.post(`/members`, member);
}

export const getLoanById = async (id) => {
  try {
    const response = await api.get(`/Loan/${id}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching loan by id:", error);
    throw error;
  }
};


export default api;
