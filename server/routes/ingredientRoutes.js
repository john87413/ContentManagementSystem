const express = require('express');
const router = express.Router();

const IngredientController = require('../controllers/ingredientController');

router.post('/', IngredientController.createIngredient);
router.get('/', IngredientController.getIngredients);
router.get('/:id', IngredientController.getIngredientById);
router.put('/:id', IngredientController.updateIngredient);
router.delete('/:id', IngredientController.deleteIngredient);

module.exports = router;
