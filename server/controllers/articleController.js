const BaseController = require('./BaseController');
const articleService = require("../services/articleService");

class ArticleController extends BaseController {
  constructor(articleService) {
    super(articleService, '文章');
  }

  // 創建新文章
  async create(req, res, next) {
    return await super.create(req, res, next);
  };

  // 取得文章列表
  async getAll (req, res, next) {
    return await super.getAll(req, res, next, {}, "title");
  };

  // 根據ID取得特定文章
  async getById (req, res, next) {
    return await super.getById(req, res, next);
  };

  // 更新文章資料
  async update (req, res, next) {
    return await super.update(req, res, next);
  };

  // 刪除特定文章
  async delete (req, res, next) {
    return await super.delete(req, res, next);
  };
}

module.exports = new ArticleController(articleService);