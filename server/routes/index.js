const express = require('express');
const categoryRoutes = require('./categoryRoutes');
const carouselRoutes = require('./carouselRoutes');
const ingredientRoutes = require('./ingredientRoutes');

const router = express.Router();

router.use('/categories', categoryRoutes);
router.use('/ingredients', ingredientRoutes);
router.use('/carousels', carouselRoutes);

module.exports = router;