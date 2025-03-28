const BaseController = require('./BaseController');
const drinkService = require("../services/drinkService");

class DrinkController extends BaseController {
  constructor(drinkService) {
    super(drinkService, '飲品');
  }

  // 創建新飲品
  createDrink = async (req, res, next) => {
    return await this.create(req, res, next);
  };

  // 取得飲品列表
  getDrinks = async (req, res, next) => {
    return await this.getAll(req, res, next);
  };

  // 根據ID取得特定飲品
  getDrinkById = async (req, res, next) => {
    return await this.getById(req, res, next);
  };

  // 更新飲品資料
  updateDrink = async (req, res, next) => {
    return await this.update(req, res, next);
  };

  // 刪除特定飲品
  deleteDrink = async (req, res, next) => {
    return await this.delete(req, res, next);
  };
}

module.exports = new DrinkController(drinkService);