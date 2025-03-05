const articleService = require("../services/articleService");
const { AppError } = require('../errors/AppError');

class ArticleController {
  constructor(articleService) {
    this.articleService = articleService;
  }

  // 創建新文章
  createArticle = async (req, res, next) => {
    try {
      const article = await this.articleService.createArticle(req.body);
      res.status(201).json(article);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('文章建立失敗', 500);
      }
      next(error);
    }
  }

  // 取得文章列表
  getArticles = async (req, res, next) => {
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
        
        const paginatedArticles = await this.articleService.getArticlesWithPagination(options, query);
        res.json(paginatedArticles);
      } else {
        // 若無分頁參數則返回全部文章
        const articles = await this.articleService.getAllArticles();
        res.json(articles);
      }
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('文章列表取得失敗', 500);
      }
      next(error);
    }
  }

  // 根據ID取得特定文章
  getArticleById = async (req, res, next) => {
    try {
      const article = await this.articleService.getArticleById(req.params.id);
      res.json(article);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('文章取得失敗', 500);
      }
      next(error);
    }
  }

  // 更新文章資料
  updateArticle = async (req, res, next) => {
    try {
      const article = await this.articleService.updateArticle(
        req.params.id, // 文章 ID
        req.body, // 更新內容
        { new: true, runValidators: true } // 返回更新後的文檔，並執行驗證
      );
      res.json(article);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('文章更新失敗', 500);
      }
      next(error);
    }
  }

  // 刪除特定文章
  deleteArticle = async (req, res, next) => {
    try {
      const result = await this.articleService.deleteArticle(req.params.id);
      res.json({ message: 'Article deleted' });
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('文章刪除失敗', 500);
      }
      next(error);
    }
  }
}

module.exports = new ArticleController(articleService);