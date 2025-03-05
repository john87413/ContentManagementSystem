const shopModel = require("../models/shopModel");
const { AppError, ResourceNotFoundError } = require('../errors/AppError');

class ShopService {
  constructor(shopModel) {
    this.shopModel = shopModel;
  }

  // 建立新門市
  async createShop(data) {
    try {
      const shop = new this.shopModel(data);
      return await shop.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw error;
      }
      throw new AppError('門市建立失敗', 500);
    }
  }

  // 取得分頁門市列表
  async getShopsWithPagination(options, query) {
    try {
      // 並行執行取得門市列表和總筆數, 並解構賦值給變數
      const [shops, total] = await Promise.all([
        this.shopModel.find(query).setOptions(options),
        this.shopModel.countDocuments(query)
      ]);
      return { shops, total };
    } catch (error) {
      throw new AppError('門市列表取得失敗', 500);
    }
  }

  // 取得所有門市，不分頁
  async getAllShops() {
    try {
      return await this.shopModel.find();
    } catch (error) {
      throw new AppError('門市列表取得失敗', 500);
    }
  }

  // 依據ID取得特定門市
  async getShopById(id) {
    try {
      const shop = await this.shopModel.findById(id);
      if (!shop) {
        throw new ResourceNotFoundError('Shop', id);
      }
      return shop;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('門市取得失敗', 500);
    }
  }

  // 更新門市資料
  async updateShop(id, data, options = {}) {
    try {
      const shop = await this.shopModel.findByIdAndUpdate(id, data, options);
      if (!shop) {
        throw new ResourceNotFoundError('Shop', id);
      }
      return shop;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('門市更新失敗', 500);
    }
  }

  // 刪除特定門市
  async deleteShop(id) {
    try {
      const shop = await this.shopModel.findById(id);
      if (!shop) {
        throw new ResourceNotFoundError('Shop', id);
      }
      await shop.deleteOne();
      return shop;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('門市刪除失敗', 500);
    }
  }
}

module.exports = new ShopService(shopModel);