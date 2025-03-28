const express = require('express');
const UserController = require('../controllers/userController');
const { requirePermissions } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', UserController.login);           // 用戶登入
router.get('/validate-token', requirePermissions([], { requireAll: false }), (req, res) => {
    res.json({ success: true, message: 'Token 有效' });
});
router.post('/', UserController.createUser);           // 新增用戶
router.get('/', requirePermissions(['systemSettings']), UserController.getUsers);              // 取得用戶列表
router.get('/:id', requirePermissions(['systemSettings']), UserController.getUserById);        // 取得特定用戶
router.put('/:id', requirePermissions(['systemSettings']), UserController.updateUser);         // 更新用戶
router.delete('/:id', requirePermissions(['systemSettings']), UserController.deleteUser);      // 刪除用戶

module.exports = router;