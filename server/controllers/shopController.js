const shopService = require("../services/shopService");

class ShopController {
  constructor(shopService) {
    this.shopService = shopService;
  }

  // 創建新門市
  createShop = async (req, res, next) => {
    try {
      const shop = await this.shopService.createShop(req.body, req.user);
      res.status(201).json(shop);
    } catch (error) {
      error.operation = error.operation || '門市建立';
      next(error);
    }
  }

  // 取得門市列表
  getShops = async (req, res, next) => {
    try {
      const { page, limit, nameQuery = "", sortField = "", sortOrder = "" } = req.query;

      // 如果有提供分頁參數
      if (page && limit) {
        const options = {
          skip: (parseInt(page) - 1) * parseInt(limit),
          limit: parseInt(limit),
        };

        // 添加排序選項
        if (sortField && sortOrder) {
          const sortDirection = sortOrder === 'desc' ? -1 : 1;
          options.sort = { [sortField]: sortDirection };
        }

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
      error.operation = error.operation || '門市列表取得';
      next(error);
    }
  }

  // 根據ID取得特定門市
  getShopById = async (req, res, next) => {
    try {
      const shop = await this.shopService.getShopById(req.params.id);
      res.json(shop);
    } catch (error) {
      error.operation = error.operation || '門市取得';
      next(error);
    }
  }

  // 更新門市資料
  updateShop = async (req, res, next) => {
    try {
      const shop = await this.shopService.updateShop(req.params.id, req.body, req.user);
      res.json(shop);
    } catch (error) {
      error.operation = error.operation || '門市更新';
      next(error);
    }
  }

  // 刪除特定門市
  deleteShop = async (req, res, next) => {
    try {
      const result = await this.shopService.deleteShop(req.params.id, req.user);
      res.json({ message: '門市已刪除' });
    } catch (error) {
      error.operation = error.operation || '門市刪除';
      next(error);
    }
  }
}

module.exports = new ShopController(shopService);