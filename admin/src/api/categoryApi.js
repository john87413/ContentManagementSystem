import axios from '@/api/axios';

export const fetchCategories = () => {
  return axios.get('/categories');
};

export const createCategory = (data) => {
  return axios.post('/categories', data);
};

export const updateCategory = (id, data) => {
  return axios.put(`/categories/${id}`, data);
};

export const deleteCategory = (id) => {
  return axios.delete(`/categories/${id}`);
};
