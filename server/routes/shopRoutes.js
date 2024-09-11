const express = require('express');
const router = express.Router();

const ShopController = require('../controllers/shopController');

router.post('/', ShopController.createShop);
router.get('/', ShopController.getShops);
router.get('/:id', ShopController.getShopById);
router.put('/:id', ShopController.updateShop);
router.delete('/:id', ShopController.deleteShop);

module.exports = router;
