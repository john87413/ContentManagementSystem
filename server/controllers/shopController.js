const BaseController = require('./BaseController');
const shopService = require("../services/shopService");

class ShopController extends BaseController {
  constructor(shopService) {
    super(shopService, '門市');
  }

  // 創建新門市
  async create(req, res, next) {
    return await super.create(req, res, next);
  };

  // 取得門市列表
  async getAll (req, res, next) {
    return await super.getAll(req, res, next);
  };

  // 根據ID取得特定門市
  async getById (req, res, next) {
    return await super.getById(req, res, next);
  };

  // 更新門市資料
  async update (req, res, next) {
    return await super.update(req, res, next);
  };

  // 刪除特定門市
  async delete (req, res, next) {
    return await super.delete(req, res, next);
  };
}

module.exports = new ShopController(shopService);