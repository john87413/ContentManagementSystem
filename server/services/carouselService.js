const BaseService = require('./BaseService');
const carouselModel = require("../models/carouselModel");

class CarouselService extends BaseService {
  constructor(carouselModel) {
    super(carouselModel, '輪播圖', 'carousels');
  }

  // 建立新輪播圖
  async createCarousel(data, user) {
    return this.create(data, user);
  }

  // 取得分頁輪播圖列表
  async getCarouselsWithPagination(options, query) {
    return this.getWithPagination(options, query);
  }

  // 取得所有輪播圖，不分頁
  async getAllCarousels() {
    return this.getAll();
  }

  // 依據ID取得特定輪播圖
  async getCarouselById(id) {
    return this.getById(id);
  }

  // 更新輪播圖資料
  async updateCarousel(id, data, user) {
    return this.update(id, data, user);
  }

  // 刪除特定輪播圖
  async deleteCarousel(id, user) {
    return this.delete(id, user);
  }
}

module.exports = new CarouselService(carouselModel);