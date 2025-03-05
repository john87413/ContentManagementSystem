const BaseService = require('./BaseService');
const categoryModel = require("../models/categoryModel");
const { ValidationError } = require('../errors/AppError');

class CategoryService extends BaseService {
  constructor(categoryModel) {
    super(categoryModel, '分類', 'categories');
  }

  // 建立新分類
  async createCategory(data) {
    return this.create(data);
  }

  // 取得分頁分類列表
  async getCategoriesWithPagination(options, query) {
    return this.getWithPagination(options, query);
  }

  // 取得所有分類，不分頁
  async getAllCategories() {
    return this.getAll();
  }

  // 依據ID取得特定分類
  async getCategoryById(id) {
    return this.getById(id);
  }

  // 更新分類資料
  async updateCategory(id, data) {
    if (data.parent && data.parent.toString() === id) {
      throw new ValidationError('分類不能設定自己為父分類');
    }
    
    return this.update(id, data);
  }

  // 刪除特定分類
  async deleteCategory(id) {
    return this.delete(id);
  }
}

module.exports = new CategoryService(categoryModel);