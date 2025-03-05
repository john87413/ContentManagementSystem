const BaseService = require('./BaseService');
const drinkModel = require("../models/drinkModel");

class DrinkService extends BaseService {
  constructor(drinkModel) {
    super(drinkModel, '飲品', 'drinks');
  }

  // 建立新飲品
  async createDrink(data) {
    return this.create(data);
  }

  // 取得分頁飲品列表
  async getDrinksWithPagination(options, query) {
    return this.getWithPagination(options, query);
  }

  // 取得所有飲品，不分頁
  async getAllDrinks() {
    return this.getAll();
  }

  // 依據ID取得特定飲品
  async getDrinkById(id) {
    return this.getById(id);
  }

  // 更新飲品資料
  async updateDrink(id, data) {
    return this.update(id, data);
  }

  // 刪除特定飲品
  async deleteDrink(id) {
    return this.delete(id);
  }
}

module.exports = new DrinkService(drinkModel);