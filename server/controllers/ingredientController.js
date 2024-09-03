const ingredientService = require("../services/ingredientService");

const ingredientController = {
    async createIngredient(req, res) {
        try {
            const ingredient = await ingredientService.createIngredient(req.body);
            res.status(201).json(ingredient);
        } catch (error) {
            if (error.errors) {
                const errorMessages = Object.values(error.errors).map(err => err.message).join(', ');
                res.status(400).json({ message: errorMessages });
            } else {
                res.status(400).json({ message: "An unexpected error occurred" });
            }
        }
    },

    async getIngredients(req, res) {
        try {
            const { page, limit, nameQuery = "" } = req.query;
            if (page && limit) {
                const options = {
                    skip: (page - 1) * limit,
                    limit: parseInt(limit, 10),
                };
                const query = {};
                if (nameQuery) query['name'] = new RegExp(nameQuery, 'i');
                const paginatedIngredients = await ingredientService.getIngredientsWithPagination(options, query);
                res.json(paginatedIngredients);
            } else {
                const Ingredients = await ingredientService.getAllIngredients();
                res.json(Ingredients);
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getIngredientById(req, res) {
        try {
            const ingredient = await ingredientService.getIngredientById(
                req.params.id
            );
            if (!ingredient) {
                return res.status(404).json({ message: "Ingredient not found" });
            }
            res.json(ingredient);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateIngredient(req, res) {
        try {
            const ingredient = await ingredientService.updateIngredient(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!ingredient) {
                return res.status(404).json({ message: "Ingredient not found" });
            }
            res.json(ingredient);
        } catch (error) {
            if (error.errors) {
                const errorMessages = Object.values(error.errors).map(err => err.message).join(', ');
                res.status(400).json({ message: errorMessages });
            } else {
                res.status(400).json({ message: "An unexpected error occurred" });
            }
        }
    },

    async deleteIngredient(req, res) {
        try {
            const result = await ingredientService.deleteIngredient(req.params.id);
            if (!result) {
                return res.status(404).json({ message: "Ingredient not found" });
            }
            res.json({ message: "Ingredient deleted" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
};

module.exports = ingredientController;
