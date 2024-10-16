class ShopService {
  constructor(shopModel) {
    this.shopModel = shopModel;
  }

  createShop = async (data) => {
    const shop = new this.shopModel(data);
    return await shop.save();
  }

  getShopsWithPagination = async (options, query) => {
    const [shops, total] = await Promise.all([
      this.shopModel.find(query).setOptions(options),
      this.shopModel.countDocuments(query)
    ]);

    return { shops, total };
  }

  getAllShops = async () => {
    return await this.shopModel.find();
  }

  getShopById = async (id) => {
    return await this.shopModel.findById(id);
  }

  updateShop = async (id, data, options = {}) => {
    return await this.shopModel.findByIdAndUpdate(id, data, { new: true, ...options });
  }

  deleteShop = async (id) => {
    const shop = await this.shopModel.findById(id);
    if (shop) {
      await shop.deleteOne();
    }
    return shop;
  }
}

const shopModel = require("../models/shopModel");
module.exports = new ShopService(shopModel);
