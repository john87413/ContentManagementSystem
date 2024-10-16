class IngredientController {
  constructor(ingredientService) {
    this.ingredientService = ingredientService;
  }

  createIngredient = async (req, res, next)  => {
    try {
      const ingredient = await this.ingredientService.createIngredient(req.body);
      res.status(201).json(ingredient);
    } catch (error) {
      next(error);
    }
  }

  getIngredients = async (req, res, next)  => {
    try {
      const { page, limit, nameQuery = "" } = req.query;
      if (page && limit) {
        const options = {
          skip: (parseInt(page) - 1) * parseInt(limit),
          limit: parseInt(limit),
        };
        const query = nameQuery ? { name: new RegExp(nameQuery, 'i') } : {};
        const paginatedIngredients = await this.ingredientService.getIngredientsWithPagination(options, query);
        res.json(paginatedIngredients);
      } else {
        const ingredients = await this.ingredientService.getAllIngredients();
        res.json(ingredients);
      }
    } catch (error) {
      next(error);
    }
  }

  getIngredientById = async (req, res, next)  => {
    try {
      const ingredient = await this.ingredientService.getIngredientById(req.params.id);
      if (!ingredient) {
        return res.status(404).json({ message: "Ingredient not found" });
      }
      res.json(ingredient);
    } catch (error) {
      next(error);
    }
  }

  updateIngredient = async (req, res, next)  => {
    try {
      const ingredient = await this.ingredientService.updateIngredient(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!ingredient) {
        return res.status(404).json({ message: "Ingredient not found" });
      }
      res.json(ingredient);
    } catch (error) {
      next(error);
    }
  }

  deleteIngredient = async (req, res, next)  => {
    try {
      const result = await this.ingredientService.deleteIngredient(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Ingredient not found" });
      }
      res.json({ message: "Ingredient deleted" });
    } catch (error) {
      next(error);
    }
  }
}

const ingredientService = require("../services/ingredientService");
module.exports = new IngredientController(ingredientService);
