// 文章相關路由
const express = require('express');
const ArticleController = require('../controllers/articleController');

const router = express.Router();

router.post('/', (req, res, next) => ArticleController.create(req, res, next));        // 新增文章
router.get('/', (req, res, next) => ArticleController.getAll(req, res, next));           // 取得文章列表
router.get('/:id', (req, res, next) => ArticleController.getById(req, res, next));     // 取得特定文章
router.put('/:id', (req, res, next) => ArticleController.update(req, res, next));      // 更新文章
router.delete('/:id', (req, res, next) => ArticleController.delete(req, res, next));   // 刪除文章

module.exports = router;
