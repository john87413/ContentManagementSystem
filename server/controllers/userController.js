const BaseController = require('./BaseController');
const userService = require("../services/userService");

class UserController extends BaseController {
  constructor(userService) {
    super(userService, '用戶');
  }

  // 創建新用戶
  async create(req, res, next) {
    return await super.create(req, res, next);
  };

  // 取得用戶列表
  async getAll (req, res, next) {
    return await super.getAll(req, res, next, {}, "username");
  };

  // 根據ID取得特定用戶
  async getById (req, res, next) {
    return await super.getById(req, res, next);
  };

  // 更新用戶資料
  async update (req, res, next) {
    return await super.update(req, res, next);
  };

  // 刪除特定用戶
  async delete (req, res, next) {
    return await super.delete(req, res, next);
  };

  // 登入 - 特定於用戶的方法
  login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const { token, user } = await this.service.login(username, password);

      res.json({ token, user });
    } catch (error) {
      error.operation = error.operation || '用戶登入';
      next(error);
    }
  };
}

module.exports = new UserController(userService);