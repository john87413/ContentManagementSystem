const BaseService = require('./BaseService');
const carouselModel = require("../models/carouselModel");

class CarouselService extends BaseService {
  constructor(carouselModel) {
    super(carouselModel, '輪播圖', 'carousels');
  }

  // 建立新輪播圖
  async create(data, user) {
    return super.create(data, user);
  }

  // 取得分頁輪播圖列表
  async getWithPagination(options, query) {
    return super.getWithPagination(options, query);
  }

  // 取得所有輪播圖，不分頁
  async getAll() {
    return super.getAll();
  }

  // 依據ID取得特定輪播圖
  async getById(id) {
    return super.getById(id);
  }

  // 更新輪播圖資料
  async update(id, data, user) {
    return super.update(id, data, user);
  }

  // 刪除特定輪播圖
  async delete(id, user) {
    return super.delete(id, user);
  }
}

module.exports = new CarouselService(carouselModel);