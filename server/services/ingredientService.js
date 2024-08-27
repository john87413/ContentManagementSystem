const ingredientModel = require('../models/ingredientModel');

module.exports = {
    createIngredient: async (data) => {
        const ingredient = new ingredientModel(data);
        return await ingredient.save();
    },

    getIngredients: async () => {
        return await ingredientModel.find();
    },

    getIngredientById: async (id) => {
        return await ingredientModel.findById(id);
    },

    updateIngredient: async (id, data) => {
        return await ingredientModel.findByIdAndUpdate(id, data, { new: true });
    },

    deleteIngredient: async (id) => {
        return await ingredientModel.findByIdAndDelete(id);
    }
};