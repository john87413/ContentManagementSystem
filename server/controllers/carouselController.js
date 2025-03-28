const BaseController = require('./BaseController');
const carouselService = require("../services/carouselService");

class CarouselController extends BaseController {
  constructor(carouselService) {
    super(carouselService, '輪播圖');
  }

  // 創建新輪播圖
  createCarousel = async (req, res, next) => {
    return await this.create(req, res, next);
  };

  // 取得輪播圖列表
  getCarousels = async (req, res, next) => {
    return await this.getAll(req, res, next);
  };

  // 根據ID取得特定輪播圖
  getCarouselById = async (req, res, next) => {
    return await this.getById(req, res, next);
  };

  // 更新輪播圖資料
  updateCarousel = async (req, res, next) => {
    return await this.update(req, res, next);
  };

  // 刪除特定輪播圖
  deleteCarousel = async (req, res, next) => {
    return await this.delete(req, res, next);
  };
}

module.exports = new CarouselController(carouselService);