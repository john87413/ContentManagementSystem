import axios from "@/api/axios";

const fetchCategories = (page, limit, nameQuery = "") => {
  const params = {
    page,
    limit,
    nameQuery,
  };
  return axios.get("/categories", { params });
};

const fetchCategory = (id) => {
  return axios.get(`/categories/${id}`);
};

const createCategory = (data) => {
  return axios.post("/categories", data);
};

const updateCategory = (id, data) => {
  return axios.put(`/categories/${id}`, data);
};

const deleteCategory = (id) => {
  return axios.delete(`/categories/${id}`);
};

export default {
  fetchCategories,
  fetchCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
