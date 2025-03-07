const bcrypt = require('bcryptjs');
const BaseService = require('./BaseService');
const userModel = require("../models/userModel");
const { ValidationError } = require('../errors/AppError');

class UserService extends BaseService {
    constructor(userModel) {
        super(userModel, '用戶', 'users');
    }

    // 創建新用戶時檢查密碼複雜度
    validatePassword(password) {
        if (password.length < 6) {
            throw new ValidationError('密碼至少需要6個字符');
        }
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
    async createUser(data) {
        this.validatePassword(data.password);
        return this.create(data);
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
    async updateUser(id, data) {
        // 如果更新密碼，檢查密碼複雜度
        if (data.password) {
            this.validatePassword(data.password);
        }
        return this.update(id, data);
    }

    // 刪除特定用戶
    async deleteUser(id) {
        return this.delete(id);
    }
}

module.exports = new UserService(userModel);