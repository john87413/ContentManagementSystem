const BaseService = require('./BaseService');
const articleModel = require("../models/articleModel");

class ArticleService extends BaseService {
  constructor(articleModel) {
    super(articleModel, '文章', 'articles');
  }

  // 建立新文章
  async createArticle(data) {
    return this.create(data);
  }

  // 取得分頁文章列表
  async getArticlesWithPagination(options, query) {
    return this.getWithPagination(options, query);
  }

  // 取得所有文章，不分頁
  async getAllArticles() {
    return this.getAll();
  }

  // 依據ID取得特定文章
  async getArticleById(id) {
    return this.getById(id);
  }

  // 更新文章資料
  async updateArticle(id, data) {
    return this.update(id, data);
  }

  // 刪除特定文章
  async deleteArticle(id) {
    return this.delete(id);
  }
}

module.exports = new ArticleService(articleModel);