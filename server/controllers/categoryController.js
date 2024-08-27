const categoryService = require('../services/categoryService');

const categoryController = {
    async createCategory(req, res) {
        try {
            const category = await categoryService.createCategory(req.body);
            res.status(201).json(category);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getCategories(req, res) {
        try {
            const categories = await categoryService.getCategories();
            res.json(categories);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getCategoryById(req, res) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json(category);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateCategory(req, res) {
        try {
            const category = await categoryService.updateCategory(req.params.id, req.body);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json(category);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteCategory(req, res) {
        try {
            const result = await categoryService.deleteCategory(req.params.id);
            if (!result) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json({ message: 'Category deleted' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = categoryController;
