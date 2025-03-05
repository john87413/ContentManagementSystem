const shopService = require("../services/shopService");
const { AppError } = require('../errors/AppError');

class ShopController {
  constructor(shopService) {
    this.shopService = shopService;
  }

  // 創建新門市
  createShop = async (req, res, next) => {
    try {
      const shop = await this.shopService.createShop(req.body);
      res.status(201).json(shop);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('門市建立失敗', 500);
      }
      next(error);
    }
  }

  // 取得門市列表
  getShops = async (req, res, next) => {
    try {
      const { page, limit, nameQuery = "" } = req.query;

      // 如果有提供分頁參數
      if (page && limit) {
        const options = {
          skip: (parseInt(page) - 1) * parseInt(limit),
          limit: parseInt(limit),
        };
        // 建立搜尋條件
        const query = nameQuery ? { name: new RegExp(nameQuery, 'i') } : {};

        const paginatedShops = await this.shopService.getShopsWithPagination(options, query);
        res.json(paginatedShops);
      } else {
        // 若無分頁參數則返回全部門市
        const shops = await this.shopService.getAllShops();
        res.json(shops);
      }
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('門市列表取得失敗', 500);
      }
      next(error);
    }
  }

  // 根據ID取得特定門市
  getShopById = async (req, res, next) => {
    try {
      const shop = await this.shopService.getShopById(req.params.id);
      res.json(shop);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('門市取得失敗', 500);
      }
      next(error);
    }
  }

  // 更新門市資料
  updateShop = async (req, res, next) => {
    try {
      const shop = await this.shopService.updateShop(
        req.params.id, // 門市 ID
        req.body, // 更新內容
        { new: true, runValidators: true } // 返回更新後的文檔，並執行驗證
      );
      res.json(shop);
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('門市更新失敗', 500);
      }
      next(error);
    }
  }

  // 刪除特定門市
  deleteShop = async (req, res, next) => {
    try {
      const result = await this.shopService.deleteShop(req.params.id);
      res.json({ message: 'Shop deleted' });
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError('門市刪除失敗', 500);
      }
      next(error);
    }
  }
}

module.exports = new ShopController(shopService);