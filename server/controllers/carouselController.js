const carouselService = require("../services/carouselService");
const { AppError } = require('../errors/AppError');

class CarouselController {
  constructor(carouselService) {
    this.carouselService = carouselService;
  }

  // 創建新輪播圖
  createCarousel = async (req, res, next) => {
    try {
      const carousel = await this.carouselService.createCarousel(req.body);
      res.status(201).json(carousel);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('輪播圖建立失敗', 500);
      }
      next(error);
    }
  }

  // 取得輪播圖列表
  getCarousels = async (req, res, next) => {
    try {
      const { page, limit, nameQuery = "" } = req.query;

      // 如果有提供分頁參數
      if (page && limit) {
        const options = {
          skip: (parseInt(page) - 1) * parseInt(limit),
          limit: parseInt(limit),
        };
        // 建立搜尋條件
        const query = nameQuery ? { name: new RegExp(nameQuery, 'i') } : {};

        const paginatedCarousels = await this.carouselService.getCarouselsWithPagination(options, query);
        res.json(paginatedCarousels);
      } else {
        // 若無分頁參數則返回全部輪播圖
        const carousels = await this.carouselService.getAllCarousels();
        res.json(carousels);
      }
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('輪播圖列表取得失敗', 500);
      }
      next(error);
    }
  }

  // 根據ID取得特定輪播圖
  getCarouselById = async (req, res, next) => {
    try {
      const carousel = await this.carouselService.getCarouselById(req.params.id);
      res.json(carousel);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('輪播圖取得失敗', 500);
      }
      next(error);
    }
  }

  // 更新輪播圖資料
  updateCarousel = async (req, res, next) => {
    try {
      const carousel = await this.carouselService.updateCarousel(
        req.params.id, // 輪播圖 ID
        req.body, // 更新內容
        { new: true, runValidators: true } // 返回更新後的文檔，並執行驗證
      );
      res.json(carousel);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('輪播圖更新失敗', 500);
      }
      next(error);
    }
  }

  // 刪除特定輪播圖
  deleteCarousel = async (req, res, next) => {
    try {
      const result = await this.carouselService.deleteCarousel(req.params.id);
      res.json({ message: 'Carousel deleted' });
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('輪播圖刪除失敗', 500);
      }
      next(error);
    }
  }
}

module.exports = new CarouselController(carouselService);