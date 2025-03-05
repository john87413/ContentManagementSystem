// 輪播圖相關路由
const express = require('express');
const CarouselController = require('../controllers/carouselController');

const router = express.Router();

router.post('/', CarouselController.createCarousel);        // 新增輪播圖
router.get('/', CarouselController.getCarousels);           // 取得輪播圖列表
router.get('/:id', CarouselController.getCarouselById);     // 取得特定輪播圖
router.put('/:id', CarouselController.updateCarousel);      // 更新輪播圖
router.delete('/:id', CarouselController.deleteCarousel);   // 刪除輪播圖

module.exports = router;
