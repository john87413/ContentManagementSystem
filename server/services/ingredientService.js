const ingredientModel = require("../models/ingredientModel");
const { AppError, ResourceNotFoundError } = require('../errors/AppError');

class IngredientService {
  constructor(ingredientModel) {
    this.ingredientModel = ingredientModel;
  }

  // 建立新配料
  async createIngredient(data) {
    try {
      const ingredient = new this.ingredientModel(data);
      return await ingredient.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw error;
      }
      throw new AppError('配料建立失敗', 500);
    }
  }

  // 取得分頁配料列表
  async getIngredientsWithPagination(options, query) {
    try {
      // 並行執行取得配料列表和總筆數, 並解構賦值給變數
      const [ingredients, total] = await Promise.all([
        this.ingredientModel.find(query).setOptions(options),
        this.ingredientModel.countDocuments(query)
      ]);
      return { ingredients, total };
    } catch (error) {
      throw new AppError('配料列表取得失敗', 500);
    }
  }

  // 取得所有配料，不分頁
  async getAllIngredients() {
    try {
      return await this.ingredientModel.find();
    } catch (error) {
      throw new AppError('配料列表取得失敗', 500);
    }
  }

  // 依據ID取得特定配料
  async getIngredientById(id) {
    try {
      const ingredient = await this.ingredientModel.findById(id);
      if (!ingredient) {
        throw new ResourceNotFoundError('Ingredient', id);
      }
      return ingredient;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('配料取得失敗', 500);
    }
  }

  // 更新配料資料
  async updateIngredient(id, data, options = {}) {
    try {
      const ingredient = await this.ingredientModel.findByIdAndUpdate(id, data, options);
      if (!ingredient) {
        throw new ResourceNotFoundError('Ingredient', id);
      }
      return ingredient;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('配料更新失敗', 500);
    }
  }

  // 刪除特定配料
  async deleteIngredient(id) {
    try {
      const ingredient = await this.ingredientModel.findById(id);
      if (!ingredient) {
        throw new ResourceNotFoundError('Ingredient', id);
      }
      await ingredient.deleteOne();
      return ingredient;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('配料刪除失敗', 500);
    }
  }
}

module.exports = new IngredientService(ingredientModel);