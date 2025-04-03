// 配料相關路由
const express = require('express');
const IngredientController = require('../controllers/ingredientController');

const router = express.Router();

router.post('/', (req, res, next) => IngredientController.create(req, res, next));        // 新增配料
router.get('/', (req, res, next) => IngredientController.getAll(req, res, next));           // 取得配料列表
router.get('/:id', (req, res, next) => IngredientController.getById(req, res, next));     // 取得特定配料
router.put('/:id', (req, res, next) => IngredientController.update(req, res, next));      // 更新配料
router.delete('/:id', (req, res, next) => IngredientController.delete(req, res, next));   // 刪除配料

module.exports = router;
