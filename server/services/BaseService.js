const mongoose = require('mongoose');
const { ResourceNotFoundError } = require('../errors/AppError');

// 基礎服務類，提供通用的 CRUD 操作供其他服務繼承
class BaseService {
    // 建立基礎服務實例
    constructor(model, resourceName, resourcesKey) {
        this.model = model;
        this.resourceName = resourceName;
        this.resourcesKey = resourcesKey;
      }

    // 檢查 ID 是否為有效的 MongoDB ObjectId
    validateId(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ResourceNotFoundError(this.resourceName, id);
        }
    }

    // 檢查資源是否存在
    validateResourceExists(resource, id) {
        if (!resource) {
            throw new ResourceNotFoundError(this.resourceName, id);
        }
    }

    // 應用查詢選項，如 populate
    applyQueryOptions(query, options = {}) {
        if (options.populate) {
            if (Array.isArray(options.populate)) {
                options.populate.forEach(field => query.populate(field));
            } else {
                query.populate(options.populate);
            }
        }

        return query;
    }

    // 建立新資源
    async create(data) {
        try {
            const resource = new this.model(data);
            return await resource.save();
        } catch (error) {
            throw error;
        }
    }

    // 取得分頁資源列表
    async getWithPagination(options, query) {
        try {
            const [resources, total] = await Promise.all([
                this.model.find(query).setOptions(options),
                this.model.countDocuments(query)
            ]);

            const result = {
                [this.resourcesKey]: resources,
                total
            };

            return result;
        } catch (error) {
            throw error;
        }
    }

    // 取得所有資源
    async getAll(query = {}, options = {}) {
        try {
            return await this.model.find(query).setOptions(options);
        } catch (error) {
            throw error;
        }
    }

    // 依據ID取得特定資源
    async getById(id, options = {}) {
        try {
            // 檢查ID格式
            this.validateId(id);

            // 建立查詢並應用選項
            const query = this.model.findById(id);
            this.applyQueryOptions(query, options);

            // 執行查詢並檢查資源是否存在
            const resource = await query;
            this.validateResourceExists(resource, id);

            return resource;
        } catch (error) {
            throw error;
        }
    }

    // 更新資源
    async update(id, data, options = { new: true, runValidators: true }) {
        try {
            // 檢查ID格式
            this.validateId(id);

            // 更新資源
            const resource = await this.model.findByIdAndUpdate(id, data, options);

            // 檢查資源是否存在
            this.validateResourceExists(resource, id);

            return resource;
        } catch (error) {
            throw error;
        }
    }

    // 刪除資源
    async delete(id) {
        try {
            // 檢查ID格式
            this.validateId(id);

            // 查找資源
            const resource = await this.model.findById(id);

            // 檢查資源是否存在
            this.validateResourceExists(resource, id);

            // 刪除資源
            await resource.deleteOne();
            return resource;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BaseService;