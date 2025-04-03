const BaseController = require('./BaseController');
const carouselService = require("../services/carouselService");

class CarouselController extends BaseController {
  constructor(carouselService) {
    super(carouselService, '輪播圖');
  }

  // 創建新輪播圖
  async create(req, res, next) {
    return await super.create(req, res, next);
  };

  // 取得輪播圖列表
  async getAll (req, res, next) {
    return await super.getAll(req, res, next);
  };

  // 根據ID取得特定輪播圖
  async getById (req, res, next) {
    return await super.getById(req, res, next);
  };

  // 更新輪播圖資料
  async update (req, res, next) {
    return await super.update(req, res, next);
  };

  // 刪除特定輪播圖
  async delete (req, res, next) {
    return await super.delete(req, res, next);
  };
}

module.exports = new CarouselController(carouselService);