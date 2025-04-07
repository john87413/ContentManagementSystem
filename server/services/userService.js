const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BaseService = require('./BaseService');
const userModel = require("../models/userModel");
const { ValidationError } = require('../errors/AppError');

class UserService extends BaseService {
    constructor(userModel) {
        super(userModel, '用戶', 'users');
    }

    // 根據角色分發權限
    getPermissionsForRole(role) {
        const permissions = {
            contentManagement: false,
            marketingManagement: false,
            systemSettings: false
        };

        switch (role) {
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

    // 用戶登入
    async login(username, password) {
        const user = await this.model.findOne({ username }).select('+password');

        if (!user) {
            throw new ValidationError('用戶不存在');
        }

        // 驗證密碼
        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            throw new ValidationError('密碼錯誤');
        }

        // 獲取權限列表
        const permissions = user.permissions ?
            Object.keys(user.permissions).filter(key => user.permissions[key])
            : [];

        // 生成JWT
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                role: user.role,
                permissions
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 返回token & 用戶資訊
        return {
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                permissions
            }
        };
    }

    // 建立新用戶
    async create(data, user) {
        // 驗證用戶是否存在
        const existingUser = await this.model.findOne({ username: data.username });
        if (existingUser) {
            throw new ValidationError('用戶已存在');
        }

        // 處理角色權限
        data.permissions = this.getPermissionsForRole(data.role);

        return super.create(data, user);
    }

    // 取得分頁用戶列表
    async getWithPagination(options, query) {
        query.role = { $ne: 'superAdmin' }; // 排除超級管理員
        return super.getWithPagination(options, query);
    }

    // 取得所有用戶，不分頁
    async getAll() {
        query.role = { $ne: 'superAdmin' }; // 排除超級管理員
        return super.getAll();
    }

    // 依據ID取得特定用戶
    async getById(id) {
        const user = await super.getById(id);
        
        // 超級管理員，拒絕存取
        if (user.role === 'superAdmin') {
            throw new ValidationError('無法查看超級管理員資料');
        }
        
        return user;
    }

    // 更新用戶資料
    async update(id, data, currentUser) {
        // 取得更新用戶
        const userToUpdate = await this.getById(id);

        if (userToUpdate.role === 'superAdmin') {
            throw new ValidationError('不可編輯超級管理員帳號');
        }

        if (data.role === 'superAdmin' &&
            userToUpdate.role !== 'superAdmin' &&
            currentUser.role !== 'superAdmin') {
            throw new ValidationError('只有超級管理員可以分配超級管理員角色');
        }

        // 處理角色權限
        if (data.role) {
            data.permissions = this.getPermissionsForRole(data.role);
        }

        return super.update(id, data, currentUser);
    }

    // 刪除特定用戶
    async delete(id, currentUser) {
        // 取得刪除用戶
        const userToDelete = await this.getById(id);

        if (id === currentUser.id) {
            throw new ValidationError('不能刪除自己的帳號');
        }

        if (userToDelete.role === 'superAdmin') {
            throw new ValidationError('不可刪除超級管理員帳號');
        }

        return super.delete(id, currentUser);
    }
}

module.exports = new UserService(userModel);