// 配料相關路由
const express = require('express');
const IngredientController = require('../controllers/ingredientController');

const router = express.Router();

router.post('/', IngredientController.createIngredient);        // 新增配料
router.get('/', IngredientController.getIngredients);           // 取得配料列表
router.get('/:id', IngredientController.getIngredientById);     // 取得特定配料
router.put('/:id', IngredientController.updateIngredient);      // 更新配料
router.delete('/:id', IngredientController.deleteIngredient);   // 刪除配料

module.exports = router;
