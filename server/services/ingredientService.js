class IngredientService {
  constructor(ingredientModel) {
    this.ingredientModel = ingredientModel;
  }

  createIngredient = async (data) => {
    const ingredient = new this.ingredientModel(data);
    return await ingredient.save();
  }

  getIngredientsWithPagination = async (options, query) => {
    const [ingredients, total] = await Promise.all([
      this.ingredientModel.find(query).setOptions(options),
      this.ingredientModel.countDocuments(query)
    ]);

    return { ingredients, total };
  }

  getAllIngredients = async () => {
    return await this.ingredientModel.find();
  }

  getIngredientById = async (id) => {
    return await this.ingredientModel.findById(id);
  }

  updateIngredient = async (id, data, options = {}) => {
    return await this.ingredientModel.findByIdAndUpdate(id, data, { new: true, ...options });
  }

  deleteIngredient = async (id) => {
    const ingredient = await this.ingredientModel.findById(id);
    if (ingredient) {
      await ingredient.deleteOne();
    }
    return ingredient;
  }
}

const ingredientModel = require("../models/ingredientModel");
module.exports = new IngredientService(ingredientModel);
