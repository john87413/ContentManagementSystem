const drinkService = require("../services/drinkService");

const drinkController = {
    async createDrink(req, res) {
        try {
            const drink = await drinkService.createDrink(req.body);
            res.status(201).json(drink);
        } catch (error) {
            if (error.errors) {
                const errorMessages = Object.values(error.errors).map(err => err.message).join(', ');
                res.status(400).json({ message: errorMessages });
            } else {
                res.status(400).json({ message: "An unexpected error occurred" });
            }
        }
    },

    async getDrinks(req, res) {
        try {
            const { page, limit, nameQuery = "" } = req.query;
            if (page && limit) {
                const options = {
                    skip: (page - 1) * limit,
                    limit: parseInt(limit, 10),
                };
                const query = {};
                if (nameQuery) query['name'] = new RegExp(nameQuery, 'i');
                const paginatedDrinks = await drinkService.getDrinksWithPagination(options, query);
                res.json(paginatedDrinks);
            } else {
                const Drinks = await drinkService.getAllDrinks();
                res.json(Drinks);
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getDrinkById(req, res) {
        try {
            const drink = await drinkService.getDrinkById(req.params.id);
            if (!drink) {
                return res.status(404).json({ message: "Drink not found" });
            }
            res.json(drink);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateDrink(req, res) {
        try {
            const drink = await drinkService.updateDrink(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!drink) {
                return res.status(404).json({ message: "Drink not found" });
            }
            res.json(drink);
        } catch (error) {
            if (error.errors) {
                const errorMessages = Object.values(error.errors).map(err => err.message).join(', ');
                res.status(400).json({ message: errorMessages });
            } else {
                res.status(400).json({ message: "An unexpected error occurred" });
            }
        }
    },

    async deleteDrink(req, res) {
        try {
            const result = await drinkService.deleteDrink(req.params.id);
            if (!result) {
                return res.status(404).json({ message: "Drink not found" });
            }
            res.json({ message: "Drink deleted" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
};

module.exports = drinkController;
