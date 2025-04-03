// 輪播圖相關路由
const express = require('express');
const CarouselController = require('../controllers/carouselController');

const router = express.Router();

router.post('/', (req, res, next) => CarouselController.create(req, res, next));        // 新增輪播圖
router.get('/', (req, res, next) => CarouselController.getAll(req, res, next));           // 取得輪播圖列表
router.get('/:id', (req, res, next) => CarouselController.getById(req, res, next));     // 取得特定輪播圖
router.put('/:id', (req, res, next) => CarouselController.update(req, res, next));      // 更新輪播圖
router.delete('/:id', (req, res, next) => CarouselController.delete(req, res, next));   // 刪除輪播圖

module.exports = router;
