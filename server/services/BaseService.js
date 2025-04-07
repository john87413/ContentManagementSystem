const mongoose = require('mongoose');
const { ResourceNotFoundError, ValidationError } = require('../errors/AppError');

// 基礎服務類，提供通用的 CRUD 操作供其他服務繼承
class BaseService {
    // 建立基礎服務實例
    constructor(model, resourceName, resourcesKey) {
        this.model = model;
        this.resourceName = resourceName;
        this.resourcesKey = resourcesKey;
    }

    // 檢查是否為超級管理員
    isSuperAdmin(user) {
        return user && user.role === 'superAdmin';
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
    async create(data, user) {
        try {
            if (user) data.updatedBy = user.id;
            const resource = new this.model(data);
            return await resource.save();
        } catch (error) {
            throw error;
        }
    }

    // 取得分頁資源列表
    async getWithPagination(options, query) {
        try {
            // 提取 selectFields 選項（如果有的話）
            const selectFields = options.populate &&
                options.populate.select ?
                options.populate.select.split(/\s+/) :
                null;

            // 檢查是否有關聯字段排序
            if (options.sort && Object.keys(options.sort).some(key => key.includes('.'))) {
                // 將 selectFields 傳給 handleRelationalSort
                if (selectFields) {
                    options.selectFields = selectFields;
                }
                return await this.handleRelationalSort(options, query);
            }

            // 常規查詢
            const [resources, total] = await Promise.all([
                this.model.find(query).setOptions(options),
                this.model.countDocuments(query)
            ]);

            return {
                [this.resourcesKey]: resources,
                total
            };
        } catch (error) {
            throw error;
        }
    }

    // 處理關聯字段排序
    async handleRelationalSort(options, query) {
        // 獲取排序字段和方向
        const sortField = Object.keys(options.sort)[0];
        const sortDirection = options.sort[sortField];

        // 解析關聯部分和字段部分
        const [relation, field] = sortField.split('.');

        // 構建聚合管道
        const pipeline = [
            { $match: query }, // 應用過濾條件

            // 查找關聯文檔
            {
                $lookup: {
                    from: this.getCollectionName(relation),
                    localField: relation,
                    foreignField: '_id',
                    as: `${relation}`,
                    // 如果有設置 selectFields，就只選取指定的字段(一定包含排序字段)
                    ...(options.selectFields && {
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,  // 始終包含 _id
                                    [field]: 1,  // 確保包含需要排序的字段
                                    ...(options.selectFields.reduce((acc, field) => {
                                        acc[field] = 1;
                                        return acc;
                                    }, {}))
                                }
                            }
                        ]
                    })
                }
            },

            // 處理關聯數據，確保字段存在
            // 如果關聯字段是空數組，則設置為 [null]，這樣後面 unwind 後會變成 null
            {
                $addFields: {
                    [relation]: {
                        $cond: {
                            if: { $eq: [{ $size: `$${relation}` }, 0] },
                            then: [null],
                            else: `$${relation}`
                        }
                    }
                }
            },

            // 展開關聯文檔數組 (保留沒有關聯的文檔)
            {
                $unwind: {
                    path: `$${relation}`,
                    preserveNullAndEmptyArrays: true
                }
            },

            // 按關聯字段排序
            {
                $sort: {
                    [`${relation}.${field}`]: sortDirection,
                    _id: 1 // 次要排序字段，保持穩定
                }
            },

            // 應用分頁
            { $skip: options.skip || 0 },
            { $limit: options.limit || 10 }
        ];

        // 執行聚合查詢
        const [resources, totalCount] = await Promise.all([
            this.model.aggregate(pipeline),
            this.model.countDocuments(query)
        ]);

        return {
            [this.resourcesKey]: resources,
            total: totalCount
        };
    }

    // 根據關聯字段名獲取集合名稱
    getCollectionName(relation) {
        // 獲取關聯字段的引用模型
        const schemaPath = this.model.schema.path(relation);

        if (schemaPath && schemaPath.options && schemaPath.options.ref) {
            // 如果有明確的 ref 選項，獲取引用的模型
            const refModel = mongoose.model(schemaPath.options.ref);
            return refModel.collection.name;
        }

        // 如果無法確定，返回默認推測的集合名稱
        return `${relation.toLowerCase()}s`;
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
    async getById(id) {
        try {
            // 檢查ID格式
            this.validateId(id);

            const resource = await this.model.findById(id);

            // 檢查資源是否存在
            this.validateResourceExists(resource, id);

            return resource;
        } catch (error) {
            throw error;
        }
    }

    // 更新資源
    async update(id, data, user, options = { new: true, runValidators: true }) {
        try {
            // 檢查ID格式
            this.validateId(id);

            const resource = await this.model.findById(id);

            // 檢查資源是否存在
            this.validateResourceExists(resource, id);
            
            // 檢查是否為受保護資料
            if (resource.isProtected && !this.isSuperAdmin(user)) {
                throw new ValidationError(`系統範例資料不可編輯`);
            }

            // 從更新資料中移除 isProtected 字段，防止用戶更改保護狀態
            if (data.isProtected !== undefined) {
                delete data.isProtected;
            }

            // 添加更新者資訊
            if (user) {
                data.updatedBy = user.id;
            }

            // 更新資源
            const updatedResource = await this.model.findByIdAndUpdate(id, data, options);
            return updatedResource;
        } catch (error) {
            throw error;
        }
    }

    // 刪除資源
    async delete(id, user) {
        try {
            // 檢查ID格式
            this.validateId(id);

            const resource = await this.model.findById(id);

            // 檢查資源是否存在
            this.validateResourceExists(resource, id);

            // 檢查是否為受保護資料
            if (resource.isProtected && !this.isSuperAdmin(user)) {
                throw new ValidationError(`系統範例資料不可刪除`);
            }

            // 刪除資源
            await resource.deleteOne();
            return resource;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BaseService;