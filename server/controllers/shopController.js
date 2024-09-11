const shopService = require("../services/shopService");

const shopController = {
    async createShop(req, res) {
        try {
            const shop = await shopService.createShop(req.body);
            res.status(201).json(shop);
        } catch (error) {
            if (error.errors) {
                const errorMessages = Object.values(error.errors).map(err => err.message).join(', ');
                res.status(400).json({ message: errorMessages });
            } else {
                res.status(400).json({ message: "An unexpected error occurred" });
            }
        }
    },

    async getShops(req, res) {
        try {
            const { page, limit, nameQuery = "" } = req.query;
            if (page && limit) {
                const options = {
                    skip: (page - 1) * limit,
                    limit: parseInt(limit, 10),
                };
                const query = {};
                if (nameQuery) query['name'] = new RegExp(nameQuery, 'i');
                const paginatedShops = await shopService.getShopsWithPagination(options, query);
                res.json(paginatedShops);
            } else {
                const Shops = await shopService.getAllShops();
                res.json(Shops);
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getShopById(req, res) {
        try {
            const shop = await shopService.getShopById(
                req.params.id
            );
            if (!shop) {
                return res.status(404).json({ message: "Shop not found" });
            }
            res.json(shop);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateShop(req, res) {
        try {
            const shop = await shopService.updateShop(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!shop) {
                return res.status(404).json({ message: "Shop not found" });
            }
            res.json(shop);
        } catch (error) {
            if (error.errors) {
                const errorMessages = Object.values(error.errors).map(err => err.message).join(', ');
                res.status(400).json({ message: errorMessages });
            } else {
                res.status(400).json({ message: "An unexpected error occurred" });
            }
        }
    },

    async deleteShop(req, res) {
        try {
            const result = await shopService.deleteShop(req.params.id);
            if (!result) {
                return res.status(404).json({ message: "Shop not found" });
            }
            res.json({ message: "Shop deleted" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
};

module.exports = shopController;
