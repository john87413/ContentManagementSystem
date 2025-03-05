const articleModel = require("../models/articleModel");
const { AppError, ResourceNotFoundError } = require('../errors/AppError');

class ArticleService {
  constructor(articleModel) {
    this.articleModel = articleModel;
  }

  // 建立新文章
  async createArticle(data) {
    try {
      const article = new this.articleModel(data);
      return await article.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw error;
      }
      throw new AppError('文章建立失敗', 500);
    }
  }

  // 取得分頁文章列表
  async getArticlesWithPagination(options, query) {
    try {
      // 並行執行取得文章列表和總筆數, 並解構賦值給變數
      const [articles, total] = await Promise.all([
        this.articleModel.find(query).setOptions(options),
        this.articleModel.countDocuments(query)
      ]);
      return { articles, total };
    } catch (error) {
      throw new AppError('文章列表取得失敗', 500);
    }
  }

  // 取得所有文章，不分頁
  async getAllArticles() {
    try {
      return await this.articleModel.find();
    } catch (error) {
      throw new AppError('文章列表取得失敗', 500);
    }
  }

  // 依據ID取得特定文章
  async getArticleById(id) {
    try {
      const article = await this.articleModel.findById(id);
      if (!article) {
        throw new ResourceNotFoundError('Article', id);
      }
      return article;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('文章取得失敗', 500);
    }
  }

  // 更新文章資料
  async updateArticle(id, data, options = {}) {
    try {
      const article = await this.articleModel.findByIdAndUpdate(id, data, options);
      if (!article) {
        throw new ResourceNotFoundError('Article', id);
      }
      return article;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('文章更新失敗', 500);
    }
  }

  // 刪除特定文章
  async deleteArticle(id) {
    try {
      const article = await this.articleModel.findById(id);
      if (!article) {
        throw new ResourceNotFoundError('Article', id);
      }
      await article.deleteOne();
      return article;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('文章刪除失敗', 500);
    }
  }
}

module.exports = new ArticleService(articleModel);