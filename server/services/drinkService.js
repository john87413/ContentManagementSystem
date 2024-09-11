const drinkModel = require("../models/drinkModel");

module.exports = {
  createDrink: async (data) => {
    const drink = new drinkModel(data);
    return await drink.save();
  },

  getDrinksWithPagination: async (options, query) => {
    const [drinks, total] = await Promise.all([
      drinkModel.find(query).setOptions(options),
      drinkModel.countDocuments(query)
    ]);

    return { drinks, total };
  },

  getAllDrinks: async () => {
    return await drinkModel.find();
  },

  getDrinkById: async (id) => {
    const drink = await drinkModel.findById(id);
    return drink;
  },

  updateDrink: async (id, data, options = {}) => {
    return await drinkModel.findByIdAndUpdate(id, data, options);
  },

  deleteDrink: async (id) => {
    return await drinkModel.findByIdAndDelete(id);
  },
};
