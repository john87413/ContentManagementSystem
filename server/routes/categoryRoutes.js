// 分類相關路由
const express = require('express');
const CategoryController = require('../controllers/categoryController');

const router = express.Router();

router.post('/', (req, res, next) => CategoryController.create(req, res, next));        // 新增分類
router.get('/', (req, res, next) => CategoryController.getAll(req, res, next));          // 取得分類列表
router.get('/:id', (req, res, next) => CategoryController.getById(req, res, next));     // 取得特定分類
router.put('/:id', (req, res, next) => CategoryController.update(req, res, next));      // 更新分類
router.delete('/:id', (req, res, next) => CategoryController.delete(req, res, next));   // 刪除分類

module.exports = router;
