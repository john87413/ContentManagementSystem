const ingredientModel = require("../models/ingredientModel");

module.exports = {
  createIngredient: async (data) => {
    const ingredient = new ingredientModel(data);
    return await ingredient.save();
  },

  getIngredientsWithPagination: async (options, query) => {
    const [ingredients, total] = await Promise.all([
      ingredientModel.find(query).setOptions(options),
      ingredientModel.countDocuments(query)
    ]);

    return { ingredients, total };
  },

  getAllIngredients: async () => {
    return await ingredientModel.find();
  },

  getIngredientById: async (id) => {
    return await ingredientModel.findById(id);
  },

  updateIngredient: async (id, data, options = {}) => {
    return await ingredientModel.findByIdAndUpdate(id, data, options);
  },

  deleteIngredient: async (id) => {
    return await ingredientModel.findByIdAndDelete(id);
  },
};
