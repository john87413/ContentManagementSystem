const express = require('express');
const UserController = require('../controllers/userController');
const { requirePermissions } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/validate-token', requirePermissions([], { requireAll: false }), (req, res) => {
    res.json({ success: true, message: 'Token 有效' });
});                                                                                                                            // 驗證 token 是否有效
router.post('/login', (req, res, next) => UserController.login(req, res, next));                                               // 用戶登入
router.post('/', (req, res, next) => UserController.create(req, res, next));                                                   // 新增用戶
router.get('/', requirePermissions(['systemSettings']), (req, res, next) => UserController.getAll(req, res, next));            // 取得用戶列表
router.get('/:id', requirePermissions(['systemSettings']), (req, res, next) => UserController.getById(req, res, next));        // 取得特定用戶
router.put('/:id', requirePermissions(['systemSettings']), (req, res, next) => UserController.update(req, res, next));         // 更新用戶
router.delete('/:id', requirePermissions(['systemSettings']), (req, res, next) => UserController.delete(req, res, next));      // 刪除用戶

module.exports = router;