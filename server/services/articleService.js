const BaseService = require('./BaseService');
const articleModel = require("../models/articleModel");

class ArticleService extends BaseService {
  constructor(articleModel) {
    super(articleModel, '文章', 'articles');
  }

  // 建立新文章
  async create(data, user) {
    return super.create(data, user);
  }

  // 取得分頁文章列表
  async getWithPagination(options, query) {
    return super.getWithPagination(options, query);
  }

  // 取得所有文章，不分頁
  async getAll() {
    return super.getAll();
  }

  // 依據ID取得特定文章
  async getById(id) {
    return super.getById(id);
  }

  // 更新文章資料
  async update(id, data, user) {
    return super.update(id, data, user);
  }

  // 刪除特定文章
  async delete(id, user) {
    return super.delete(id, user);
  }
}

module.exports = new ArticleService(articleModel);