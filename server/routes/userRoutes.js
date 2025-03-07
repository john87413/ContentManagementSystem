const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();

router.post('/login', UserController.login);           // 用戶登入
router.post('/', UserController.createUser);           // 新增用戶
router.get('/', UserController.getUsers);              // 取得用戶列表
router.get('/:id', UserController.getUserById);        // 取得特定用戶
router.put('/:id', UserController.updateUser);         // 更新用戶
router.delete('/:id', UserController.deleteUser);      // 刪除用戶

module.exports = router;