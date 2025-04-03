// 飲品相關路由
const express = require('express');
const DrinkController = require('../controllers/drinkController');

const router = express.Router();

router.post('/', (req, res, next) => DrinkController.create(req, res, next));          // 新增飲品
router.get('/', (req, res, next) => DrinkController.getAll(req, res, next));             // 取得飲品列表
router.get('/:id', (req, res, next) => DrinkController.getById(req, res, next));       // 取得特定飲品
router.put('/:id', (req, res, next) => DrinkController.update(req, res, next));        // 更新飲品
router.delete('/:id', (req, res, next) => DrinkController.delete(req, res, next));     // 刪除飲品

module.exports = router;
