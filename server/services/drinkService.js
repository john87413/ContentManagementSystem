const BaseService = require('./BaseService');
const drinkModel = require("../models/drinkModel");

class DrinkService extends BaseService {
  constructor(drinkModel) {
    super(drinkModel, '飲品', 'drinks');
  }

  // 建立新飲品
  async create(data, user) {
    return super.create(data, user);
  }

  // 取得分頁飲品列表
  async getWithPagination(options, query) {
    return super.getWithPagination(options, query);
  }

  // 取得所有飲品，不分頁
  async getAll() {
    return super.getAll();
  }

  // 依據ID取得特定飲品
  async getById(id) {
    return super.getById(id);
  }

  // 更新飲品資料
  async update(id, data, user) {
    return super.update(id, data, user);
  }

  // 刪除特定飲品
  async delete(id, user) {
    return super.delete(id, user);
  }
}

module.exports = new DrinkService(drinkModel);