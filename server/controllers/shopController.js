class ShopController {
  constructor(shopService) {
    this.shopService = shopService;
  }

  createShop = async (req, res, next) => {
    try {
      const shop = await this.shopService.createShop(req.body);
      res.status(201).json(shop);
    } catch (error) {
      next(error);
    }
  }

  getShops = async (req, res, next) => {
    try {
      const { page, limit, nameQuery = "" } = req.query;
      if (page && limit) {
        const options = {
          skip: (parseInt(page) - 1) * parseInt(limit),
          limit: parseInt(limit),
        };
        const query = nameQuery ? { name: new RegExp(nameQuery, 'i') } : {};
        const paginatedShops = await this.shopService.getShopsWithPagination(options, query);
        res.json(paginatedShops);
      } else {
        const shops = await this.shopService.getAllShops();
        res.json(shops);
      }
    } catch (error) {
      next(error);
    }
  }

  getShopById = async (req, res, next) => {
    try {
      const shop = await this.shopService.getShopById(req.params.id);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      res.json(shop);
    } catch (error) {
      next(error);
    }
  }

  updateShop = async (req, res, next) => {
    try {
      const shop = await this.shopService.updateShop(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      res.json(shop);
    } catch (error) {
      next(error);
    }
  }

  deleteShop = async (req, res, next) => {
    try {
      const result = await this.shopService.deleteShop(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Shop not found" });
      }
      res.json({ message: "Shop deleted" });
    } catch (error) {
      next(error);
    }
  }
}

const shopService = require("../services/shopService");
module.exports = new ShopController(shopService);
