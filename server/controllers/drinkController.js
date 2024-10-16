class DrinkController {
  constructor(drinkService) {
    this.drinkService = drinkService;
  }

  createDrink = async (req, res, next) => {
    try {
      const drink = await this.drinkService.createDrink(req.body);
      res.status(201).json(drink);
    } catch (error) {
      next(error);
    }
  }

  getDrinks = async (req, res, next) => {
    try {
      const { page, limit, nameQuery = "" } = req.query;
      if (page && limit) {
        const options = {
          skip: (parseInt(page) - 1) * parseInt(limit),
          limit: parseInt(limit),
        };
        const query = nameQuery ? { name: new RegExp(nameQuery, 'i') } : {};
        const paginatedDrinks = await this.drinkService.getDrinksWithPagination(options, query);
        res.json(paginatedDrinks);
      } else {
        const drinks = await this.drinkService.getAllDrinks();
        res.json(drinks);
      }
    } catch (error) {
      next(error);
    }
  }

  getDrinkById = async (req, res, next) => {
    try {
      const drink = await this.drinkService.getDrinkById(req.params.id);
      if (!drink) {
        return res.status(404).json({ message: "Drink not found" });
      }
      res.json(drink);
    } catch (error) {
      next(error);
    }
  }

  updateDrink = async (req, res, next) => {
    try {
      const drink = await this.drinkService.updateDrink(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!drink) {
        return res.status(404).json({ message: "Drink not found" });
      }
      res.json(drink);
    } catch (error) {
      next(error);
    }
  }

  deleteDrink = async (req, res, next) => {
    try {
      const result = await this.drinkService.deleteDrink(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Drink not found" });
      }
      res.json({ message: "Drink deleted" });
    } catch (error) {
      next(error);
    }
  }
}

const drinkService = require("../services/drinkService");
module.exports = new DrinkController(drinkService);
