const articleService = require("../services/articleService");

class ArticleController {
  constructor(articleService) {
    this.articleService = articleService;
  }

  // 創建新文章
  createArticle = async (req, res, next) => {
    try {
      const article = await this.articleService.createArticle(req.body, req.user);
      res.status(201).json(article);
    } catch (error) {
      error.operation = error.operation || '文章建立';
      next(error);
    }
  }

  // 取得文章列表
  getArticles = async (req, res, next) => {
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

        const paginatedArticles = await this.articleService.getArticlesWithPagination(options, query);
        res.json(paginatedArticles);
      } else {
        // 若無分頁參數則返回全部文章
        const articles = await this.articleService.getAllArticles();
        res.json(articles);
      }
    } catch (error) {
      error.operation = error.operation || '文章列表取得';
      next(error);
    }
  }

  // 根據ID取得特定文章
  getArticleById = async (req, res, next) => {
    try {
      const article = await this.articleService.getArticleById(req.params.id);
      res.json(article);
    } catch (error) {
      error.operation = error.operation || '文章取得';
      next(error);
    }
  }

  // 更新文章資料
  updateArticle = async (req, res, next) => {
    try {
      const article = await this.articleService.updateArticle(req.params.id, req.body, req.user);
      res.json(article);
    } catch (error) {
      error.operation = error.operation || '文章更新';
      next(error);
    }
  }

  // 刪除特定文章
  deleteArticle = async (req, res, next) => {
    try {
      const result = await this.articleService.deleteArticle(req.params.id, req.user);
      res.json({ message: '文章已刪除' });
    } catch (error) {
      error.operation = error.operation || '文章刪除';
      next(error);
    }
  }
}

module.exports = new ArticleController(articleService);