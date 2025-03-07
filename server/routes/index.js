const express = require('express');
const { requirePermissions } = require('../middlewares/authMiddleware');
const categoryRoutes = require('./categoryRoutes');
const carouselRoutes = require('./carouselRoutes');
const ingredientRoutes = require('./ingredientRoutes');
const shopRoutes = require('./shopRoutes');
const drinkRoutes = require('./drinkRoutes');
const articleRoutes = require('./articleRoutes');
const userRoutes = require('./userRoutes');
const uploadRoutes = require('./uploadRoute');

const router = express.Router();

// API 路由註冊
router.use('/rest/categories', requirePermissions(['contentManagement']), categoryRoutes);    // 分類相關路由
router.use('/rest/ingredients', requirePermissions(['contentManagement']), ingredientRoutes); // 配料相關路由
router.use('/rest/drinks', requirePermissions(['contentManagement']), drinkRoutes);          // 飲品相關路由
router.use('/rest/carousels', requirePermissions(['marketingManagement']), carouselRoutes);    // 輪播圖相關路由
router.use('/rest/articles', requirePermissions(['marketingManagement']), articleRoutes);       // 文章相關路由
router.use('/rest/shops', requirePermissions(['marketingManagement']), shopRoutes);            // 門市相關路由
router.use('/rest/users', userRoutes);            // 用戶相關路由
router.use('/upload', uploadRoutes);              // 上傳相關路由

module.exports = router;