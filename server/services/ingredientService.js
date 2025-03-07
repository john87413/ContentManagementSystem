const BaseService = require('./BaseService');
const ingredientModel = require("../models/ingredientModel");

class IngredientService extends BaseService {
  constructor(ingredientModel) {
    super(ingredientModel, '配料', 'ingredients');
  }

  // 建立新配料
  async createIngredient(data) {
    return this.create(data);
  }

  // 取得分頁配料列表
  async getIngredientsWithPagination(options, query) {
    return this.getWithPagination(options, query);
  }

  // 取得所有配料，不分頁
  async getAllIngredients() {
    return this.getAll();
  }

  // 依據ID取得特定配料
  async getIngredientById(id) {
    return this.getById(id);
  }

  // 更新配料資料
  async updateIngredient(id, data) {
    return this.update(id, data);
  }

  // 刪除特定配料
  async deleteIngredient(id) {
    return this.delete(id);
  }
}

module.exports = new IngredientService(ingredientModel);