// 門市相關路由
const express = require('express');
const ShopController = require('../controllers/shopController');

const router = express.Router();

router.post('/', (req, res, next) => ShopController.create(req, res, next));        // 新增門市
router.get('/', (req, res, next) => ShopController.getAll(req, res, next));           // 取得門市列表
router.get('/:id', (req, res, next) => ShopController.getById(req, res, next));     // 取得特定門市
router.put('/:id', (req, res, next) => ShopController.update(req, res, next));      // 更新門市
router.delete('/:id', (req, res, next) => ShopController.delete(req, res, next));   // 刪除門市

module.exports = router;
