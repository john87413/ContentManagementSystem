class ArticleService {
  constructor(articleModel) {
    this.articleModel = articleModel;
  }
  async createArticle(data) {
    const article = new this.articleModel(data);
    return await article.save();
  }

  async getArticlesWithPagination(options, query) {
    const [articles, total] = await Promise.all([
      this.articleModel.find(query).setOptions(options),
      this.articleModel.countDocuments(query)
    ]);

    return { articles, total };
  }

  async getAllArticles() {
    return await this.articleModel.find();
  }

  async getArticleById(id) {
    return await this.articleModel.findById(id);
  }

  async updateArticle(id, data, options = {}) {
    return await this.articleModel.findByIdAndUpdate(id, data, { new: true, ...options });
  }

  async deleteArticle(id) {
    const article = await this.articleModel.findById(id);
    if (article) {
      await article.deleteOne();
    }
    return article;
  }
}

const articleModel = require("../models/articleModel");
module.exports = new ArticleService(articleModel);
