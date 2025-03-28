const BaseController = require('./BaseController');
const ingredientService = require("../services/ingredientService");

class IngredientController extends BaseController {
  constructor(ingredientService) {
    super(ingredientService, '配料');
  }

  // 創建新配料
  createIngredient = async (req, res, next) => {
    return await this.create(req, res, next);
  };

  // 取得配料列表
  getIngredients = async (req, res, next) => {
    return await this.getAll(req, res, next);
  };

  // 根據ID取得特定配料
  getIngredientById = async (req, res, next) => {
    return await this.getById(req, res, next);
  };

  // 更新配料資料
  updateIngredient = async (req, res, next) => {
    return await this.update(req, res, next);
  };

  // 刪除特定配料
  deleteIngredient = async (req, res, next) => {
    return await this.delete(req, res, next);
  };
}

module.exports = new IngredientController(ingredientService);