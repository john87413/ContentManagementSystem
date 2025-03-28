const BaseController = require('./BaseController');
const categoryService = require("../services/categoryService");

class CategoryController extends BaseController {
  constructor(categoryService) {
    super(categoryService, '分類');
  }

  // 創建新分類
  createCategory = async (req, res, next) => {
    return await this.create(req, res, next);
  };

  // 取得分類列表
  getCategories = async (req, res, next) => {
    const categoryOptions = {
      populate: {
        path: "parent",
        select: "name _id"
      }
    };
    
    return await this.getAll(req, res, next, categoryOptions);
  };

  // 根據ID取得特定分類
  getCategoryById = async (req, res, next) => {
    return await this.getById(req, res, next);
  };

  // 更新分類資料
  updateCategory = async (req, res, next) => {
    return await this.update(req, res, next);
  };

  // 刪除特定分類
  deleteCategory = async (req, res, next) => {
    return await this.delete(req, res, next);
  };
}

module.exports = new CategoryController(categoryService);