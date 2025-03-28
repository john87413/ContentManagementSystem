// server/controllers/BaseController.js
class BaseController {
    constructor(service, resourceName) {
        this.service = service;
        this.resourceName = resourceName;
    }

    // 創建資源
    create = async (req, res, next) => {
        try {
            const resource = await this.service.create(req.body, req.user);
            res.status(201).json(resource);
        } catch (error) {
            error.operation = error.operation || `${this.resourceName}建立`;
            next(error);
        }
    };

    // 取得資源列表（支援分頁、搜尋、排序）
    // 添加參數 customOptions 允許子類傳入自定義選項
    getAll = async (req, res, next, customOptions = {}, searchField = "name") => {
        try {
            const { page, limit, nameQuery = "", sortField = "", sortOrder = "" } = req.query;


            // 如果有提供分頁參數
            if (page && limit) {
                // 基本選項
                const options = {
                    skip: (parseInt(page) - 1) * parseInt(limit),
                    limit: parseInt(limit),
                    ...customOptions
                };

                // 添加排序選項
                if (sortField && sortOrder) {
                    const sortDirection = sortOrder === 'desc' ? -1 : 1;
                    options.sort = { [sortField]: sortDirection };
                }

                // 建立搜尋條件
                const query = nameQuery ? { [searchField]: new RegExp(nameQuery, 'i') } : {};

                const result = await this.service.getWithPagination(options, query);
                res.json(result);
            } else {
                const resources = await this.service.getAll();
                res.json(resources);
            }
        } catch (error) {
            console.log(error);
            error.operation = error.operation || `${this.resourceName}列表取得`;
            next(error);
        }
    };

    // 根據ID取得特定資源
    getById = async (req, res, next) => {
        try {
            const resource = await this.service.getById(req.params.id);
            res.json(resource);
        } catch (error) {
            error.operation = error.operation || `${this.resourceName}取得`;
            next(error);
        }
    };

    // 更新資源資料
    update = async (req, res, next) => {
        try {
            const resource = await this.service.update(req.params.id, req.body, req.user);
            res.json(resource);
        } catch (error) {
            error.operation = error.operation || `${this.resourceName}更新`;
            next(error);
        }
    };

    // 刪除特定資源
    delete = async (req, res, next) => {
        try {
            const result = await this.service.delete(req.params.id, req.user);
            res.json({ message: `${this.resourceName}已刪除` });
        } catch (error) {
            error.operation = error.operation || `${this.resourceName}刪除`;
            next(error);
        }
    };
}

module.exports = BaseController;