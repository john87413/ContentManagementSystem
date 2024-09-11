const shopModel = require("../models/shopModel");

module.exports = {
  createShop: async (data) => {
    const shop = new shopModel(data);
    return await shop.save();
  },

  getShopsWithPagination: async (options, query) => {
    const [shops, total] = await Promise.all([
      shopModel.find(query).setOptions(options),
      shopModel.countDocuments(query)
    ]);

    return { shops, total };
  },

  getAllShops: async () => {
    return await shopModel.find();
  },

  getShopById: async (id) => {
    return await shopModel.findById(id);
  },

  updateShop: async (id, data, options = {}) => {
    return await shopModel.findByIdAndUpdate(id, data, options);
  },

  deleteShop: async (id) => {
    return await shopModel.findByIdAndDelete(id);
  },
};
