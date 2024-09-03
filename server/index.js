const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const apiRoutes = require("./routes"); // 引入統一的路由入口

dotenv.config();
connectDB();

const app = express();

app.use(require("cors")());
app.use(express.json());
app.use("/api/rest", apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const ingredientModel = require("./models/ingredientModel");

// const ingredients = [
//   { name: '珍珠', price: 10 },     // 珍珠奶茶中的標誌性配料
//   { name: '椰果', price: 10 },     // 椰子果肉，常用於水果茶中
//   { name: '仙草凍', price: 15 },   // 涼爽的仙草凍
//   { name: '布丁', price: 20 },     // 調和奶茶的甜品布丁
//   { name: '愛玉', price: 15 },     // 傳統台灣甜品愛玉
//   { name: '芋圓', price: 20 },     // 芋頭製成的Q彈芋圓
//   { name: '粉條', price: 10 },     // 類似於仙草凍的透明粉條
//   { name: '紅豆', price: 15 },     // 經典的甜品配料紅豆
//   { name: '綠豆', price: 15 },     // 清涼消暑的綠豆
//   { name: '珍珠粉圓', price: 15 }, // 小型的珍珠
//   { name: '爆漿珍珠', price: 20 }, // 咬下去有餡料的爆漿珍珠
//   { name: '草莓果凍', price: 15 }, // 甜美的草莓味果凍
//   { name: '咖啡凍', price: 15 },   // 帶有咖啡風味的果凍
//   { name: '椰果粒', price: 10 },   // 小顆的椰果粒
//   { name: '百香果籽', price: 15 }, // 富含口感的百香果籽
//   { name: '珍珠1', price: 10 },     // 珍珠奶茶中的標誌性配料
//   { name: '椰果1', price: 10 },     // 椰子果肉，常用於水果茶中
//   { name: '仙草凍1', price: 15 },   // 涼爽的仙草凍
//   { name: '布丁1', price: 20 },     // 調和奶茶的甜品布丁
//   { name: '愛玉1', price: 15 },     // 傳統台灣甜品愛玉
//   { name: '芋圓1', price: 20 },     // 芋頭製成的Q彈芋圓
//   { name: '粉條1', price: 10 },     // 類似於仙草凍的透明粉條
//   { name: '紅豆1', price: 15 },     // 經典的甜品配料紅豆
//   { name: '綠豆1', price: 15 },     // 清涼消暑的綠豆
//   { name: '珍珠粉圓1', price: 15 }, // 小型的珍珠
//   { name: '爆漿珍珠1', price: 20 }, // 咬下去有餡料的爆漿珍珠
//   { name: '草莓果凍1', price: 15 }, // 甜美的草莓味果凍
//   { name: '咖啡凍1', price: 15 },   // 帶有咖啡風味的果凍
//   { name: '椰果粒1', price: 10 },   // 小顆的椰果粒
//   { name: '百香果籽1', price: 15 }, // 富含口感的百香果籽
// ];

// // 批量插入資料的函數
// async function insertData() {
//   try {
//     await ingredientModel.insertMany(ingredients);
//     console.log("資料插入成功");
//   } catch (error) {
//     console.error("資料插入失敗", error);
//   }
// }

// // 執行插入資料
// insertData();
