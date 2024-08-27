import { defineStore } from 'pinia';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/api/categoryApi';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    loading: false,
    error: null,
  }),
  
  actions: {
    async loadCategories() {
      this.loading = true;
      try {
        const response = await fetchCategories();
        this.categories = response.data;
      } catch (err) {
        this.error = err;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    
    async addCategory(categoryData) {
      try {
        await createCategory(categoryData);
        await this.loadCategories();
      } catch (err) {
        this.error = err;
      }
    },
    
    async modifyCategory(id, categoryData) {
      try {
        await updateCategory(id, categoryData);
        await this.loadCategories();
      } catch (err) {
        this.error = err;
      }
    },
    
    async removeCategory(id) {
      try {
        await deleteCategory(id);
        await this.loadCategories();
      } catch (err) {
        this.error = err;
      }
    },
  },
});
