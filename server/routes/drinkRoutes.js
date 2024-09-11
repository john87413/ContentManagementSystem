const express = require('express');
const router = express.Router();

const DrinkController = require('../controllers/drinkController');

router.post('/', DrinkController.createDrink);
router.get('/', DrinkController.getDrinks);
router.get('/:id', DrinkController.getDrinkById);
router.put('/:id', DrinkController.updateDrink);
router.delete('/:id', DrinkController.deleteDrink);

module.exports = router;
