const bcrypt = require('bcryptjs');
const BaseService = require('./BaseService');
const userModel = require("../models/userModel");
const { ValidationError } = require('../errors/AppError');

class UserService extends BaseService {
    constructor(userModel) {
        super(userModel, '用戶', 'users');
    }

    // 處理角色權限邏輯
    getPermissionsForRole(role) {
        const permissions = {
            contentManagement: false,
            marketingManagement: false,
            systemSettings: false
        };

        switch (role) {
            case 'superAdmin':
                permissions.contentManagement = true;
                permissions.marketingManagement = true;
                permissions.systemSettings = true;
                break;
            case 'contentManager':
                permissions.contentManagement = true;
                break;
            case 'marketingManager':
                permissions.marketingManagement = true;
                break;
            case 'systemAdmin':
                permissions.contentManagement = true;
                permissions.marketingManagement = true;
                permissions.systemSettings = true;
                break;
        }

        return permissions;
    }

    // 驗證使用者憑證
    async validateCredentials(username, password) {
        const user = await this.model.findOne({ username }).select('+password');

        if (!user) {
            throw new ValidationError('用戶不存在');
        }

        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            throw new ValidationError('密碼錯誤');
        }

        return user;
    }

    // 創建新用戶
    async createUser(data, user) {
        data.permissions = this.getPermissionsForRole(data.role);
        return this.create(data, user);
    }

    // 取得分頁用戶列表
    async getUsersWithPagination(options, query) {
        return this.getWithPagination(options, query);
    }

    // 取得所有用戶，不分頁
    async getAllUsers() {
        return this.getAll();
    }

    // 依據ID取得特定用戶
    async getUserById(id) {
        return this.getById(id);
    }

    // 更新用戶資料
    async updateUser(id, data, user) {
        data.permissions = this.getPermissionsForRole(data.role);
        return this.update(id, data, user);
    }

    // 刪除特定用戶
    async deleteUser(id, user) {
        return this.delete(id, user);
    }
}

module.exports = new UserService(userModel);