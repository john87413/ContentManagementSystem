const BaseController = require('./BaseController');
const ingredientService = require("../services/ingredientService");

class IngredientController extends BaseController {
  constructor(ingredientService) {
    super(ingredientService, '配料');
  }

  // 創建新配料
  async create(req, res, next) {
    return await super.create(req, res, next);
  };

  // 取得配料列表
  async getAll (req, res, next) {
    return await super.getAll(req, res, next);
  };

  // 根據ID取得特定配料
  async getById (req, res, next) {
    return await super.getById(req, res, next);
  };

  // 更新配料資料
  async update (req, res, next) {
    return await super.update(req, res, next);
  };

  // 刪除特定配料
  async delete (req, res, next) {
    return await super.delete(req, res, next);
  };
}

module.exports = new IngredientController(ingredientService);