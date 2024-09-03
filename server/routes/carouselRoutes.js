const express = require('express');
const router = express.Router();

const CarouselController = require('../controllers/carouselController');

router.post('/', CarouselController.createCarousel);
router.get('/', CarouselController.getCarousels);
router.get('/:id', CarouselController.getCarouselById);
router.put('/:id', CarouselController.updateCarousel);
router.delete('/:id', CarouselController.deleteCarousel);

module.exports = router;
