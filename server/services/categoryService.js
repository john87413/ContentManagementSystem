const BaseService = require('./BaseService');
const categoryModel = require("../models/categoryModel");
const { ValidationError } = require('../errors/AppError');

class CategoryService extends BaseService {
  constructor(categoryModel) {
    super(categoryModel, '分類', 'categories');
  }

  // 建立新分類
  async create(data, user) {
    return super.create(data, user);
  }

  // 取得分頁分類列表
  async getWithPagination(options, query) {
    return super.getWithPagination(options, query);
  }

  // 取得所有分類，不分頁
  async getAll() {
    return super.getAll();
  }

  // 依據ID取得特定分類
  async getById(id) {
    return super.getById(id);
  }

  // 更新分類資料
  async update(id, data, user) {
    if (data.parent && data.parent.toString() === id) {
      throw new ValidationError('分類不能設定自己為父分類');
    }
    
    return super.update(id, data, user);
  }

  // 刪除特定分類
  async delete(id, user) {
    // 檢查是否有子分類引用該分類
    const hasChildCategories = await this.model.exists({ parent: id });
    if (hasChildCategories) {
      throw new ValidationError('無法刪除：此分類有子分類正在使用');
    }
    return super.delete(id, user);
  }
}

module.exports = new CategoryService(categoryModel);