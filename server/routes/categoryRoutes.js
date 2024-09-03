const express = require('express');
const router = express.Router();
const categoryModel = require("../models/categoryModel");

const CategoryController = require('../controllers/categoryController');

router.post('/', CategoryController.createCategory);
router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategoryById);
router.put('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;
