// 文章相關路由
const express = require('express');
const ArticleController = require('../controllers/articleController');

const router = express.Router();

router.post('/', ArticleController.createArticle);        // 新增文章
router.get('/', ArticleController.getArticles);           // 取得文章列表
router.get('/:id', ArticleController.getArticleById);     // 取得特定文章
router.put('/:id', ArticleController.updateArticle);      // 更新文章
router.delete('/:id', ArticleController.deleteArticle);   // 刪除文章

module.exports = router;
