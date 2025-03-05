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
      if (!(error instanceof AppError)) {
        error = new AppError(`飲品建立失敗`, 500);
      }
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
      if (!(error instanceof AppError)) {
        error = new AppError(`飲品列表取得失敗`, 500);
      }
      next(error);
    }
  }

  // 根據ID取得特定飲品
  getDrinkById = async (req, res, next) => {
    try {
      const drink = await this.drinkService.getDrinkById(req.params.id);
      res.json(drink);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError(`飲品取得失敗`, 500);
      }
      next(error);
    }
  }

  // 更新飲品資料
  updateDrink = async (req, res, next) => {
    try {
      const drink = await this.drinkService.updateDrink(
        req.params.id, // 飲品 ID
        req.body, // 更新內容
        { new: true, runValidators: true } // 返回更新後的文檔，並執行驗證
      );
      res.json(drink);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError(`飲品更新失敗`, 500);
      }
      next(error);
    }
  }

  // 刪除特定飲品
  deleteDrink = async (req, res, next) => {
    try {
      const result = await this.drinkService.deleteDrink(req.params.id);     
      res.json({ message: "Drink deleted" });
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError(`飲品刪除失敗`, 500);
      }
      next(error);
    }
  }
}

module.exports = new DrinkController(drinkService);