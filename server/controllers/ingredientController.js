const ingredientService = require("../services/ingredientService");

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
      error.operation = error.operation || '配料建立';
      next(error);
    }
  }

  // 取得配料列表
  getIngredients = async (req, res, next) => {
    try {
      const { page, limit, nameQuery = "", sortField = "", sortOrder = "" } = req.query;

      // 如果有提供分頁參數
      if (page && limit) {
        const options = {
          skip: (parseInt(page) - 1) * parseInt(limit),
          limit: parseInt(limit),
        };
        
        // 添加排序選項
        if (sortField && sortOrder) {
          const sortDirection = sortOrder === 'desc' ? -1 : 1;
          options.sort = { [sortField]: sortDirection };
        }

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
      error.operation = error.operation || '配料列表取得';
      next(error);
    }
  }

  // 根據ID取得特定配料
  getIngredientById = async (req, res, next) => {
    try {
      const ingredient = await this.ingredientService.getIngredientById(req.params.id);
      res.json(ingredient);
    } catch (error) {
      error.operation = error.operation || '配料取得';
      next(error);
    }
  }

  // 更新配料資料
  updateIngredient = async (req, res, next) => {
    try {
      const ingredient = await this.ingredientService.updateIngredient(req.params.id, req.body);
      res.json(ingredient);
    } catch (error) {
      error.operation = error.operation || '配料更新';
      next(error);
    }
  }

  // 刪除特定配料
  deleteIngredient = async (req, res, next) => {
    try {
      const result = await this.ingredientService.deleteIngredient(req.params.id);
      res.json({ message: '配料已刪除' });
    } catch (error) {
      error.operation = error.operation || '配料刪除';
      next(error);
    }
  }
}

module.exports = new IngredientController(ingredientService);