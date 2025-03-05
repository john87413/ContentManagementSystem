const carouselModel = require("../models/carouselModel");
const { AppError, ResourceNotFoundError } = require('../errors/AppError');

class CarouselService {
  constructor(carouselModel) {
    this.carouselModel = carouselModel;
  }

  // 建立新輪播圖
  async createCarousel(data) {
    try {
      const carousel = new this.carouselModel(data);
      return await carousel.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw error;
      }
      throw new AppError('輪播圖建立失敗', 500);
    }
  }

  // 取得分頁輪播圖列表
  async getCarouselsWithPagination(options, query) {
    try {
      // 並行執行取得輪播圖列表和總筆數, 並解構賦值給變數
      const [carousels, total] = await Promise.all([
        this.carouselModel.find(query).setOptions(options),
        this.carouselModel.countDocuments(query)
      ]);
      return { carousels, total };
    } catch (error) {
      throw new AppError('輪播圖列表取得失敗', 500);
    }
  }

  // 取得所有輪播圖，不分頁
  async getAllCarousels() {
    try {
      return await this.carouselModel.find();
    } catch (error) {
      throw new AppError('輪播圖列表取得失敗', 500);
    }
  }

  // 依據ID取得特定輪播圖
  async getCarouselById(id) {
    try {
      const carousel = await this.carouselModel.findById(id);
      if (!carousel) {
        throw new ResourceNotFoundError('Carousel', id);
      }
      return carousel;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('輪播圖取得失敗', 500);
    }
  }

  // 更新輪播圖資料
  async updateCarousel(id, data, options = {}) {
    try {
      const carousel = await this.carouselModel.findByIdAndUpdate(id, data, options);
      if (!carousel) {
        throw new ResourceNotFoundError('Carousel', id);
      }
      return carousel;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('輪播圖更新失敗', 500);
    }
  }

  // 刪除特定輪播圖
  async deleteCarousel(id) {
    try {
      const carousel = await this.carouselModel.findById(id);
      if (!carousel) {
        throw new ResourceNotFoundError('Carousel', id);
      }
      await carousel.deleteOne();
      return carousel;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('輪播圖刪除失敗', 500);
    }
  }
}

module.exports = new CarouselService(carouselModel);