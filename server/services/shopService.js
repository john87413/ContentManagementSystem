const BaseService = require('./BaseService');
const shopModel = require("../models/shopModel");

class ShopService extends BaseService {
  constructor(shopModel) {
    super(shopModel, '門市', 'shops');
  }

  // 建立新門市
  async create(data, user) {
    return super.create(data, user);
  }

  // 取得分頁門市列表
  async getWithPagination(options, query) {
    return super.getWithPagination(options, query);
  }

  // 取得所有門市，不分頁
  async getAll() {
    return super.getAll();
  }

  // 依據ID取得特定門市
  async getById(id) {
    return super.getById(id);
  }

  // 更新門市資料
  async update(id, data, user) {
    return super.update(id, data, user);
  }

  // 刪除特定門市
  async delete(id, user) {
    return super.delete(id, user);
  }
}

module.exports = new ShopService(shopModel);