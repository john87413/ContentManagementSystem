const carouselService = require("../services/carouselService");

class CarouselController {
  constructor(carouselService) {
    this.carouselService = carouselService;
  }

  // 創建新輪播圖
  createCarousel = async (req, res, next) => {
    try {
      const carousel = await this.carouselService.createCarousel(req.body, req.user);
      res.status(201).json(carousel);
    } catch (error) {
      error.operation = error.operation || '門市刪除';
      next(error);
    }
  }

  // 取得輪播圖列表
  getCarousels = async (req, res, next) => {
    try {
      const { page, limit, nameQuery = "", sortField = "", sortOrder = "" } = req.query;

      // 如果有提供分頁參數
      if (page && limit) {
        const options = {
          skip: (parseInt(page) - 1) * parseInt(limit),
          limit: parseInt(limit),
        };
        
        // 添加排序選項
        if (sortField && sortOrder) {
          const sortDirection = sortOrder === 'desc' ? -1 : 1;
          options.sort = { [sortField]: sortDirection };
        }

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
      error.operation = error.operation || '門市刪除';
      next(error);
    }
  }

  // 根據ID取得特定輪播圖
  getCarouselById = async (req, res, next) => {
    try {
      const carousel = await this.carouselService.getCarouselById(req.params.id);
      res.json(carousel);
    } catch (error) {
      error.operation = error.operation || '門市刪除';
      next(error);
    }
  }

  // 更新輪播圖資料
  updateCarousel = async (req, res, next) => {
    try {
      const carousel = await this.carouselService.updateCarousel(req.params.id, req.body, req.user);
      res.json(carousel);
    } catch (error) {
      error.operation = error.operation || '門市刪除';
      next(error);
    }
  }

  // 刪除特定輪播圖
  deleteCarousel = async (req, res, next) => {
    try {
      const result = await this.carouselService.deleteCarousel(req.params.id, req.user);
      res.json({ message: '輪播圖已刪除' });
    } catch (error) {
      error.operation = error.operation || '門市刪除';
      next(error);
    }
  }
}

module.exports = new CarouselController(carouselService);