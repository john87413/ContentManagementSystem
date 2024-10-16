class ArticleController {
  constructor(articleService) {
    this.articleService = articleService;
  }

  createArticle = async (req, res, next) => {
    try {
      const article = await this.articleService.createArticle(req.body);
      res.status(201).json(article);
    } catch (error) {
      next(error);
    }
  }

  getArticles = async (req, res, next) => {
    try {
      const { page, limit, nameQuery = "" } = req.query;
      if (page && limit) {
        const options = {
          skip: (parseInt(page) - 1) * parseInt(limit),
          limit: parseInt(limit),
        };
        const query = nameQuery ? { name: new RegExp(nameQuery, 'i') } : {};
        const paginatedArticles = await this.articleService.getArticlesWithPagination(options, query);
        res.json(paginatedArticles);
      } else {
        const articles = await this.articleService.getAllArticles();
        res.json(articles);
      }
    } catch (error) {
      next(error);
    }
  }

  getArticleById = async (req, res, next) => {
    try {
      const article = await this.articleService.getArticleById(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      next(error);
    }
  }

  updateArticle = async (req, res, next) => {
    try {
      const article = await this.articleService.updateArticle(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      next(error);
    }
  }

  deleteArticle = async (req, res, next) => {
    try {
      const result = await this.articleService.deleteArticle(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json({ message: "Article deleted" });
    } catch (error) {
      next(error);
    }
  }
}

const articleService = require("../services/articleService");
module.exports = new ArticleController(articleService);
