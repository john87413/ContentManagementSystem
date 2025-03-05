const ingredientService = require("../services/ingredientService");
const { AppError } = require('../errors/AppError');

class IngredientController {
  constructor(ingredientService) {
    this.ingredientService = ingredientService;
  }

  // 創建新配料
  createIngredient = async (req, res, next) => {
    try {
      const ingredient = await this.ingredientService.createIngredient(req.body);
      res.status(201).json(ingredient);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('配料建立失敗', 500);
      }
      next(error);
    }
  }

  // 取得配料列表
  getIngredients = async (req, res, next) => {
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

        const paginatedIngredients = await this.ingredientService.getIngredientsWithPagination(options, query);
        res.json(paginatedIngredients);
      } else {
        // 若無分頁參數則返回全部配料
        const ingredients = await this.ingredientService.getAllIngredients();
        res.json(ingredients);
      }
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('配料列表取得失敗', 500);
      }
      next(error);
    }
  }

  // 根據ID取得特定配料
  getIngredientById = async (req, res, next) => {
    try {
      const ingredient = await this.ingredientService.getIngredientById(req.params.id);
      res.json(ingredient);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('配料取得失敗', 500);
      }
      next(error);
    }
  }

  // 更新配料資料
  updateIngredient = async (req, res, next) => {
    try {
      const ingredient = await this.ingredientService.updateIngredient(
        req.params.id, // 配料 ID
        req.body, // 更新內容
        { new: true, runValidators: true } // 返回更新後的文檔，並執行驗證
      );
      res.json(ingredient);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('配料更新失敗', 500);
      }
      next(error);
    }
  }

  // 刪除特定配料
  deleteIngredient = async (req, res, next) => {
    try {
      const result = await this.ingredientService.deleteIngredient(req.params.id);
      res.json({ message: 'Ingredient deleted' });
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('配料刪除失敗', 500);
      }
      next(error);
    }
  }
}

module.exports = new IngredientController(ingredientService);