const categoryService = require('../services/categoryService');

const categoryController = {
    async createCategory(req, res) {
        try {
            const category = await categoryService.createCategory(req.body);
            res.status(201).json(category);
        } catch (error) {
            if (error.errors) {
                const errorMessages = Object.values(error.errors).map(err => err.message).join(', ');
                res.status(400).json({ message: errorMessages });
            } else {
                res.status(400).json({ message: "An unexpected error occurred" });
            }
        }
    },

    async getCategories(req, res) {
        try {
            const { page, limit, nameQuery = '' } = req.query;
            if (page && limit) {
                const options = {
                    populate: { path: "parent" },
                    skip: (page - 1) * limit,
                    limit: parseInt(limit, 10),
                };
                const query = {};
                if (nameQuery) query['name'] = new RegExp(nameQuery, 'i');
                
                const paginatedCategories = await categoryService.getCategoriesWithPagination(options, query);
                res.json(paginatedCategories);
            } else {
                const categories = await categoryService.getAllCategories();
                res.json(categories);
            }
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
            const category = await categoryService.updateCategory(req.params.id, req.body, { new: true, runValidators: true });
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json(category);
        } catch (error) {
            if (error.errors) {
                const errorMessages = Object.values(error.errors).map(err => err.message).join(', ');
                res.status(400).json({ message: errorMessages });
            } else {
                res.status(400).json({ message: "An unexpected error occurred" });
            }
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
