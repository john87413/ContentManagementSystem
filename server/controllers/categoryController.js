const BaseController = require('./BaseController');
const categoryService = require("../services/categoryService");

class CategoryController extends BaseController {
  constructor(categoryService) {
    super(categoryService, '分類');
  }

  // 創建新分類
  async create(req, res, next) {
    return await super.create(req, res, next);
  };

  // 取得分類列表
  async getAll (req, res, next) {
    const categoryOptions = {
      populate: {
        path: "parent",
        select: "name _id"
      }
    };
    return await super.getAll(req, res, next, categoryOptions);
  };

  // 根據ID取得特定分類
  async getById (req, res, next) {
    return await super.getById(req, res, next);
  };

  // 更新分類資料
  async update (req, res, next) {
    return await super.update(req, res, next);
  };

  // 刪除特定分類
  async delete (req, res, next) {
    return await super.delete(req, res, next);
  };
}

module.exports = new CategoryController(categoryService);