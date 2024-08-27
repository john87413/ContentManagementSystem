const ingredientService = require('../services/ingredientService');

const ingredientController = {
    async createIngredient(req, res) {
        try {
            const Ingredient = await ingredientService.createIngredient(req.body);
            res.status(201).json(Ingredient);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getIngredients(req, res) {
        try {
            const ingredients = await ingredientService.getIngredients();
            res.json(ingredients);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getIngredientById(req, res) {
        try {
            const Ingredient = await ingredientService.getIngredientById(req.params.id);
            if (!Ingredient) {
                return res.status(404).json({ message: 'Ingredient not found' });
            }
            res.json(Ingredient);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateIngredient(req, res) {
        try {
            const Ingredient = await ingredientService.updateIngredient(req.params.id, req.body);
            if (!Ingredient) {
                return res.status(404).json({ message: 'Ingredient not found' });
            }
            res.json(Ingredient);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteIngredient(req, res) {
        try {
            const result = await ingredientService.deleteIngredient(req.params.id);
            if (!result) {
                return res.status(404).json({ message: 'Ingredient not found' });
            }
            res.json({ message: 'Ingredient deleted' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = ingredientController;
