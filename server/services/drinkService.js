const drinkModel = require("../models/drinkModel");
const { AppError, ResourceNotFoundError } = require('../errors/AppError');

class DrinkService {
  constructor(drinkModel) {
    this.drinkModel = drinkModel;
  }

  // 建立新飲品
  async createDrink(data) {
    try {
      const drink = new this.drinkModel(data);
      return await drink.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw error;
      }
      throw new AppError('飲品建立失敗', 500);
    }
  }

  // 取得分頁飲品列表
  async getDrinksWithPagination(options, query) {
    // 並行執行取得飲品列表和總筆數, 並解構賦值給變數
    try {
      const [drinks, total] = await Promise.all([
        this.drinkModel.find(query).setOptions(options),
        this.drinkModel.countDocuments(query)
      ]);
      return { drinks, total };
    } catch (error) {
      throw new AppError('飲品列表取得失敗', 500);
    }
  }

  // 取得所有飲品，不分頁
  async getAllDrinks() {
    try {
      const drinks = await this.drinkModel.find();
      return drinks;
    } catch (error) {
      throw new AppError('飲品列表取得失敗', 500);

    }
  }

  // 依據ID取得特定飲品
  async getDrinkById(id) {
    try {
      const drink = await this.drinkModel.findById(id);
      if (!drink) {
        throw new ResourceNotFoundError('Drink', id);
      }
      return drink;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('飲品取得失敗', 500);
    }
  }

  // 更新飲品資料
  async updateDrink(id, data, options = {}) {
    try {
      const drink = await this.drinkModel.findByIdAndUpdate(id, data, options);
      if (!drink) {
        throw new ResourceNotFoundError('Drink', id);
      }
      return drink;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('飲品更新失敗', 500);
    }
  }

  // 刪除特定飲品
  async deleteDrink(id) {
    try {
      const drink = await this.drinkModel.findById(id);
      if (!drink) {
        throw new ResourceNotFoundError('Drink', id);
      }
      await drink.deleteOne();
      return drink;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('飲品刪除失敗', 500);
    }
  }
}

module.exports = new DrinkService(drinkModel);