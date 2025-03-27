const userService = require("../services/userService");
const jwt = require('jsonwebtoken');
const { ValidationError } = require('../errors/AppError');

class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    // 登入
    login = async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const user = await this.userService.validateCredentials(username, password);

            // 提取權限列表
            const permissions = user.permissions ?
                Object.keys(user.permissions).filter(key => user.permissions[key])
                : [];

            // 生成 JWT Token
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

            res.json({
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    permissions
                }
            });
        } catch (error) {
            error.operation = error.operation || '用戶登入';
            next(error);
        }
    }

    // 創建新用戶
    createUser = async (req, res, next) => {
        try {
            const user = await this.userService.createUser(req.body, req.user);
            res.status(201).json(user);
        } catch (error) {
            error.operation = error.operation || '用戶建立';
            next(error);
        }
    }

    // 取得用戶列表
    getUsers = async (req, res, next) => {
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
                const query = nameQuery ? { username: new RegExp(nameQuery, 'i') } : {};

                const paginatedUsers = await this.userService.getUsersWithPagination(options, query);
                res.json(paginatedUsers);
            } else {
                const users = await this.userService.getAllUsers();
                res.json(users);
            }
        } catch (error) {
            error.operation = error.operation || '用戶列表取得';
            next(error);
        }
    }

    // 根據ID取得特定用戶
    getUserById = async (req, res, next) => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            res.json(user);
        } catch (error) {
            error.operation = error.operation || '用戶取得';
            next(error);
        }
    }

    // 更新用戶資料
    updateUser = async (req, res, next) => {
        try {
            const userId = req.params.id;
            const currentUser = req.user;

            // 獲取要更新的用戶
            const userToUpdate = await this.userService.getUserById(userId);

            if (userToUpdate.role === 'superAdmin') {
                throw new ValidationError('不可編輯超級管理員帳號');
            }

            if (
                req.body.role === 'superAdmin' &&
                userToUpdate.role !== 'superAdmin' &&
                currentUser.role !== 'superAdmin'
            ) {
                throw new ValidationError('只有超級管理員可以分配超級管理員角色');
            }

            const user = await this.userService.updateUser(userId, req.body, currentUser);
            res.json(user);
        } catch (error) {
            error.operation = error.operation || '用戶更新';
            next(error);
        }
    }

    // 刪除特定用戶
    deleteUser = async (req, res, next) => {
        try {
            const userId = req.params.id;
            const currentUser = req.user;

            // 獲取要刪除的用戶
            const userToDelete = await this.userService.getUserById(userId);

            // 不能刪除自己
            if (userId === currentUser.id) {
                throw new ValidationError('不能刪除自己的帳號');
            }

            // 只有超級管理員可以刪除超級管理員
            if (userToDelete.role === 'superAdmin') {
                throw new ValidationError('不可刪除超級管理員帳號');
            }

            const result = await this.userService.deleteUser(userId, currentUser);
            res.json({ message: '用戶已刪除' });
        } catch (error) {
            error.operation = error.operation || '用戶刪除';
            next(error);
        }
    }
}

module.exports = new UserController(userService);