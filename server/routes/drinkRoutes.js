// 飲品相關路由
const express = require('express');
const DrinkController = require('../controllers/drinkController');

const router = express.Router();

router.post('/', DrinkController.createDrink);          // 新增飲品
router.get('/', DrinkController.getDrinks);             // 取得飲品列表
router.get('/:id', DrinkController.getDrinkById);       // 取得特定飲品
router.put('/:id', DrinkController.updateDrink);        // 更新飲品
router.delete('/:id', DrinkController.deleteDrink);     // 刪除飲品

module.exports = router;
