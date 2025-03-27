const userService = require("../services/userService");

class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    // 登入
    login = async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const { token, user } = await this.userService.login(username, password);

            res.json({ token, user });
        } catch (error) {
            error.operation = error.operation || '用戶登入';
            next(error);
        }
    }

    // 建立新用戶
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

                const result = await this.userService.getUsersWithPagination(options, query);
                res.json(result);
            } else {
                // 若無分頁參數則返回全部用戶
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
            const user = await this.userService.updateUser(req.params.id, req.body, req.user);

            res.json(user);
        } catch (error) {
            error.operation = error.operation || '用戶更新';
            next(error);
        }
    }

    // 刪除特定用戶
    deleteUser = async (req, res, next) => {
        try {
            const result = await this.userService.deleteUser(req.params.id, req.user);

            res.json({ message: '用戶已刪除' });
        } catch (error) {
            error.operation = error.operation || '用戶刪除';
            next(error);
        }
    }
}

module.exports = new UserController(userService);