const express = require('express');
const categoryRoutes = require('./categoryRoutes');
const IngredientRoutes = require('./ingredientRoutes');

const router = express.Router();

router.use('/categories', categoryRoutes);
router.use('/ingredients', IngredientRoutes);

module.exports = router;