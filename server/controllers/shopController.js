const BaseController = require('./BaseController');
const shopService = require("../services/shopService");

class ShopController extends BaseController {
  constructor(shopService) {
    super(shopService, '門市');
  }

  // 創建新門市
  createShop = async (req, res, next) => {
    return await this.create(req, res, next);
  };

  // 取得門市列表
  getShops = async (req, res, next) => {
    return await this.getAll(req, res, next);
  };

  // 根據ID取得特定門市
  getShopById = async (req, res, next) => {
    return await this.getById(req, res, next);
  };

  // 更新門市資料
  updateShop = async (req, res, next) => {
    return await this.update(req, res, next);
  };

  // 刪除特定門市
  deleteShop = async (req, res, next) => {
    return await this.delete(req, res, next);
  };
}

module.exports = new ShopController(shopService);