const BaseController = require('./BaseController');
const articleService = require("../services/articleService");

class ArticleController extends BaseController {
  constructor(articleService) {
    super(articleService, '文章');
  }

  // 創建新文章
  createArticle = async (req, res, next) => {
    return await this.create(req, res, next);
  };

  // 取得文章列表
  getArticles = async (req, res, next) => {
    return await this.getAll(req, res, next, {}, "title");
  };

  // 根據ID取得特定文章
  getArticleById = async (req, res, next) => {
    return await this.getById(req, res, next);
  };

  // 更新文章資料
  updateArticle = async (req, res, next) => {
    return await this.update(req, res, next);
  };

  // 刪除特定文章
  deleteArticle = async (req, res, next) => {
    return await this.delete(req, res, next);
  };
}

module.exports = new ArticleController(articleService);