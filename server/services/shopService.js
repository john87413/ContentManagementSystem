const BaseService = require('./BaseService');
const shopModel = require("../models/shopModel");

class ShopService extends BaseService {
  constructor(shopModel) {
    super(shopModel, '門市', 'shops');
  }

  // 建立新門市
  async createShop(data) {
    return this.create(data);
  }

  // 取得分頁門市列表
  async getShopsWithPagination(options, query) {
    return this.getWithPagination(options, query);
  }

  // 取得所有門市，不分頁
  async getAllShops() {
    return this.getAll();
  }

  // 依據ID取得特定門市
  async getShopById(id) {
    return this.getById(id);
  }

  // 更新門市資料
  async updateShop(id, data) {
    return this.update(id, data);
  }

  // 刪除特定門市
  async deleteShop(id) {
    return this.delete(id);
  }
}

module.exports = new ShopService(shopModel);