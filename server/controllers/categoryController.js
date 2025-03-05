const categoryService = require("../services/categoryService");
const { AppError } = require('../errors/AppError');

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
      if (!(error instanceof AppError)) {
        error = new AppError('分類建立失敗', 500);
      }
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
      if (!(error instanceof AppError)) {
        error = new AppError('分類列表取得失敗', 500);
      }
      next(error);
    }
  }

  // 根據ID取得特定分類
  getCategoryById = async (req, res, next) => {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);
      res.json(category);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('分類取得失敗', 500);
      }
      next(error);
    }
  }

  // 更新分類資料
  updateCategory = async (req, res, next) => {
    try {
      const category = await this.categoryService.updateCategory(
        req.params.id, // 分類 ID
        req.body, // 更新內容
        { new: true, runValidators: true } // 返回更新後的文檔，並執行驗證
      );
      res.json(category);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('分類更新失敗', 500);
      }
      next(error);
    }
  }

  // 刪除特定分類
  deleteCategory = async (req, res, next) => {
    try {
      const result = await this.categoryService.deleteCategory(req.params.id);
      res.json({ message: '分類已刪除' });
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('分類刪除失敗', 500);
      }
      next(error);
    }
  }
}

module.exports = new CategoryController(categoryService);