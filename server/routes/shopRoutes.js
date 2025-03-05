// 門市相關路由
const express = require('express');
const ShopController = require('../controllers/shopController');

const router = express.Router();

router.post('/', ShopController.createShop);        // 新增門市
router.get('/', ShopController.getShops);           // 取得門市列表
router.get('/:id', ShopController.getShopById);     // 取得特定門市
router.put('/:id', ShopController.updateShop);      // 更新門市
router.delete('/:id', ShopController.deleteShop);   // 刪除門市

module.exports = router;
