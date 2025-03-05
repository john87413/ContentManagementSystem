// 分類相關路由
const express = require('express');
const CategoryController = require('../controllers/categoryController');

const router = express.Router();

router.post('/', CategoryController.createCategory);        // 新增分類
router.get('/', CategoryController.getCategories);          // 取得分類列表
router.get('/:id', CategoryController.getCategoryById);     // 取得特定分類
router.put('/:id', CategoryController.updateCategory);      // 更新分類
router.delete('/:id', CategoryController.deleteCategory);   // 刪除分類

module.exports = router;
