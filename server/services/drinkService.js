class DrinkService {

  constructor(drinkModel) {
    this.drinkModel = drinkModel;
  }

  async createDrink(data) {
    const drink = new drinkModel(data);
    return await drink.save();
  }

  async getDrinksWithPagination(options, query) {
    const [drinks, total] = await Promise.all([
      drinkModel.find(query).setOptions(options),
      drinkModel.countDocuments(query)
    ]);

    return { drinks, total };
  }

  async getAllDrinks() {
    return await drinkModel.find();
  }

  async getDrinkById(id) {
    return await drinkModel.findById(id);
  }

  async updateDrink(id, data, options = {}) {
    return await drinkModel.findByIdAndUpdate(id, data, { new: true, ...options });
  }

  async deleteDrink(id) {
    const drink = await this.drinkModel.findById(id);
    if (drink) {
      await drink.deleteOne();
    }
    return drink;
  }
}

const drinkModel = require("../models/drinkModel");
module.exports = new DrinkService(drinkModel);