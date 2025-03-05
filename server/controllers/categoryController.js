const categoryService = require("../services/categoryService");

class CategoryController {
  constructor(categoryService) {
    this.categoryService = categoryService;
  }

  // 創建新分類
  createCategory = async (req, res, next) => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      error.operation = error.operation || '分類建立';
      next(error);
    }
  }

  // 取得分類列表
  getCategories = async (req, res, next) => {
    try {
      const { page, limit, nameQuery = '' } = req.query;

      // 如果有提供分頁參數
      if (page && limit) {
        const options = {
          populate: { path: "parent" }, // 關聯父分類資料
          skip: (parseInt(page) - 1) * parseInt(limit),
          limit: parseInt(limit),
        };
        // 建立搜尋條件
        const query = nameQuery ? { name: new RegExp(nameQuery, 'i') } : {};

        const paginatedCategories = await this.categoryService.getCategoriesWithPagination(options, query);
        res.json(paginatedCategories);
      } else {
        // 若無分頁參數則返回全部分類
        const categories = await this.categoryService.getAllCategories();
        res.json(categories);
      }
    } catch (error) {
      error.operation = error.operation || '分類列表取得';
      next(error);
    }
  }

  // 根據ID取得特定分類
  getCategoryById = async (req, res, next) => {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);
      res.json(category);
    } catch (error) {
      error.operation = error.operation || '分類取得';
      next(error);
    }
  }

  // 更新分類資料
  updateCategory = async (req, res, next) => {
    try {
      const category = await this.categoryService.updateCategory(req.params.id, req.body);
      res.json(category);
    } catch (error) {
      console.log(error);
      error.operation = error.operation || '分類更新';
      next(error);
    }
  }

  // 刪除特定分類
  deleteCategory = async (req, res, next) => {
    try {
      const result = await this.categoryService.deleteCategory(req.params.id);
      res.json({ message: '分類已刪除' });
    } catch (error) {
      error.operation = error.operation || '分類刪除';
      next(error);
    }
  }
}

module.exports = new CategoryController(categoryService);