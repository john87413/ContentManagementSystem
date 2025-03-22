require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// 引入所有模型
const Category = require('../models/categoryModel');
const Drink = require('../models/drinkModel');
const Shop = require('../models/shopModel');
const Ingredient = require('../models/ingredientModel');
const Article = require('../models/articleModel');
const Carousel = require('../models/carouselModel');

// 連接資料庫
connectDB();

// 保護現有資料的函數
async function protectExistingData() {
    try {
        console.log('開始保護現有資料...');

        // 為每個模型設置保護標記
        const models = [
            { model: Category, name: '分類' },
            { model: Drink, name: '飲品' },
            { model: Shop, name: '門市' },
            { model: Ingredient, name: '配料' },
            { model: Article, name: '文章' },
            { model: Carousel, name: '輪播圖' }
        ];

        for (const { model, name } of models) {
            const count = await model.countDocuments();
            if (count > 0) {
                const result = await model.updateMany({}, { isProtected: true });
                console.log(`已保護 ${result.modifiedCount} 個${name}`);
            } else {
                console.log(`沒有${name}需要保護`);
            }
        }

        console.log('所有現有資料已成功標記為受保護');
    } catch (error) {
        console.error('保護資料時發生錯誤:', error);
    } finally {
        // 關閉資料庫連接
        mongoose.disconnect();
    }
}

// 執行保護操作
protectExistingData();