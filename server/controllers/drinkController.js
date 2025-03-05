const drinkService = require("../services/drinkService");

class DrinkController {
  constructor(drinkService) {
    this.drinkService = drinkService;
  }

  // 創建新飲品
  createDrink = async (req, res, next) => {
    try {
      const drink = await this.drinkService.createDrink(req.body);
      res.status(201).json(drink);
    } catch (error) {
      console.log(error);
      error.operation = error.operation || '飲品建立';
      next(error);
    }
  }

  // 取得飲品列表
  getDrinks = async (req, res, next) => {
    try {
      const { page, limit, nameQuery = "" } = req.query;

      // 如果有提供分頁參數
      if (page && limit) {
        const options = {
          skip: (parseInt(page) - 1) * parseInt(limit),
          limit: parseInt(limit),
        };
        // 建立搜尋條件
        const query = nameQuery ? { name: new RegExp(nameQuery, 'i') } : {};

        const paginatedDrinks = await this.drinkService.getDrinksWithPagination(options, query);
        res.json(paginatedDrinks);
      } else {
        // 若無分頁參數則返回全部飲品
        const drinks = await this.drinkService.getAllDrinks();
        res.json(drinks);
      }
    } catch (error) {
      error.operation = error.operation || '飲品列表取得';
      next(error);
    }
  }

  // 根據ID取得特定飲品
  getDrinkById = async (req, res, next) => {
    try {
      const drink = await this.drinkService.getDrinkById(req.params.id);
      res.json(drink);
    } catch (error) {
      error.operation = error.operation || '飲品取得';
      next(error);
    }
  }

  // 更新飲品資料
  updateDrink = async (req, res, next) => {
    try {
      const drink = await this.drinkService.updateDrink(req.params.id, req.body);
      res.json(drink);
    } catch (error) {
      error.operation = error.operation || '飲品更新';
      next(error);
    }
  }

  // 刪除特定飲品
  deleteDrink = async (req, res, next) => {
    try {
      const result = await this.drinkService.deleteDrink(req.params.id);
      res.json({ message: "飲品已刪除" });
    } catch (error) {
      error.operation = error.operation || '飲品刪除';
      next(error);
    }
  }
}

module.exports = new DrinkController(drinkService);