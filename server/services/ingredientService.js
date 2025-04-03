const BaseService = require('./BaseService');
const ingredientModel = require("../models/ingredientModel");

class IngredientService extends BaseService {
  constructor(ingredientModel) {
    super(ingredientModel, '配料', 'ingredients');
  }

  // 建立新配料
  async create(data, user) {
    return super.create(data, user);
  }

  // 取得分頁配料列表
  async getWithPagination(options, query) {
    return super.getWithPagination(options, query);
  }

  // 取得所有配料，不分頁
  async getAll() {
    return super.getAll();
  }

  // 依據ID取得特定配料
  async getById(id) {
    return super.getById(id);
  }

  // 更新配料資料
  async update(id, data, user) {
    return super.update(id, data, user);
  }

  // 刪除特定配料
  async delete(id, user) {
    return super.delete(id, user);
  }
}

module.exports = new IngredientService(ingredientModel);