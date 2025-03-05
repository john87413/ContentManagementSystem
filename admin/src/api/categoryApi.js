import axios from "@/api/axios";

const fetchCategories = (page, limit, nameQuery = "", sortField = "", sortOrder = "") => {
  const params = {
      page,
      limit,
      nameQuery,
      sortField,
      sortOrder
  };
  return axios.get("/rest/categories", { params });
};

const fetchCategory = (id) => {
  return axios.get(`/rest/categories/${id}`);
};

const createCategory = (data) => {
  return axios.post("/rest/categories", data);
};

const updateCategory = (id, data) => {
  return axios.put(`/rest/categories/${id}`, data);
};

const deleteCategory = (id) => {
  return axios.delete(`/rest/categories/${id}`);
};

export default {
  fetchCategories,
  fetchCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
