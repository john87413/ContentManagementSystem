const BaseController = require('./BaseController');
const drinkService = require("../services/drinkService");

class DrinkController extends BaseController {
  constructor(drinkService) {
    super(drinkService, '飲品');
  }

  // 創建新飲品
  async create(req, res, next) {
    return await super.create(req, res, next);
  };

  // 取得飲品列表
  async getAll (req, res, next) {
    return await super.getAll(req, res, next);
  };

  // 根據ID取得特定飲品
  async getById (req, res, next) {
    return await super.getById(req, res, next);
  };

  // 更新飲品資料
  async update (req, res, next) {
    return await super.update(req, res, next);
  };

  // 刪除特定飲品
  async delete (req, res, next) {
    return await super.delete(req, res, next);
  };
}

module.exports = new DrinkController(drinkService);