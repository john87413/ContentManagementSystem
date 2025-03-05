const categoryModel = require("../models/categoryModel");
const { AppError, ResourceNotFoundError } = require('../errors/AppError');

class CategoryService {
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  // 建立新分類
  async createCategory(data) {
    try {
      const category = new this.categoryModel(data);
      return await category.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw error;
      }
      throw new AppError('分類建立失敗', 500);
    }
  }

  // 取得分頁分類列表
  async getCategoriesWithPagination(options, query) {
    try {
      const [categories, total] = await Promise.all([
        this.categoryModel.find(query).setOptions(options),
        this.categoryModel.countDocuments(query)
      ]);
      return { categories, total };
    } catch (error) {
      throw new AppError('分類列表取得失敗', 500);
    }
  }

  // 取得所有分類，不分頁
  async getAllCategories() {
    try {
      return await this.categoryModel.find();
    } catch (error) {
      throw new AppError('分類列表取得失敗', 500);
    }
  }

  // 依據ID取得特定分類
  async getCategoryById(id) {
    try {
      const category = await this.categoryModel.findById(id);
      if (!category) {
        throw new ResourceNotFoundError('Category', id);
      }
      return category;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('分類取得失敗', 500);
    }
  }

  // 更新分類資料
  async updateCategory(id, data, options = {}) {
    try {
      const category = await this.categoryModel.findByIdAndUpdate(id, data, options);
      if (!category) {
        throw new ResourceNotFoundError('Category', id);
      }
      return category;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('分類更新失敗', 500);
    }
  }

  // 刪除特定分類
  async deleteCategory(id) {
    try {
      const category = await this.categoryModel.findById(id);
      if (!category) {
        throw new ResourceNotFoundError('Category', id);
      }
      await category.deleteOne();
      return category;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('分類刪除失敗', 500);
    }
  }
}

module.exports = new CategoryService(categoryModel);