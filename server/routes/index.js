const express = require('express');
const categoryRoutes = require('./categoryRoutes');
const carouselRoutes = require('./carouselRoutes');
const ingredientRoutes = require('./ingredientRoutes');
const shopRoutes = require('./shopRoutes');
const drinkRoutes = require('./drinkRoutes');
const articleRoutes = require('./articleRoutes');

const uploadRoutes = require('./uploadRoute');

const router = express.Router();

router.use('/rest/categories', categoryRoutes);
router.use('/rest/ingredients', ingredientRoutes);
router.use('/rest/shops', shopRoutes);
router.use('/rest/drinks', drinkRoutes);
router.use('/rest/articles', articleRoutes);
router.use('/rest/carousels', carouselRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;