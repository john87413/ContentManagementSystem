const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const apiRoutes = require("./routes"); // 引入統一的路由入口
const handleError = require("./middlewares/handleError"); // 引入錯誤處理中間件

dotenv.config();
connectDB();

const app = express();

app.use(require("cors")());
app.use(express.json());
app.use("/api", apiRoutes);
app.use(handleError);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const shopModel = require("./models/shopModel");

// const shops = [
//   {
//     name: "珍珠奶茶工坊",
//     phone: "031234567",
//     city: "臺北市",
//     district: "大安區",
//     address: "忠孝東路四段123號",
//   },
//   {
//     name: "清心福全",
//     phone: "022345678",
//     city: "新北市",
//     district: "板橋區",
//     address: "中山路一段456號",
//   },
//   {
//     name: "50嵐",
//     phone: "043456789",
//     city: "臺中市",
//     district: "西屯區",
//     address: "文心路三段789號",
//   },
//   {
//     name: "鮮茶道",
//     phone: "054567890",
//     city: "嘉義市",
//     district: "東區",
//     address: "中山路二段101號",
//   },
//   {
//     name: "迷客夏",
//     phone: "075678901",
//     city: "高雄市",
//     district: "左營區",
//     address: "博愛路五段202號",
//   },
//   {
//     name: "茶湯會",
//     phone: "066789012",
//     city: "臺南市",
//     district: "中西區",
//     address: "成功路三段303號",
//   },
//   {
//     name: "大苑子",
//     phone: "037890123",
//     city: "桃園市",
//     district: "中壢區",
//     address: "中正路一段404號",
//   },
//   {
//     name: "Coco都可",
//     phone: "028901234",
//     city: "基隆市",
//     district: "仁愛區",
//     address: "忠一路五段505號",
//   },
//   {
//     name: "日出茶太",
//     phone: "059012345",
//     city: "雲林縣",
//     district: "斗六市",
//     address: "雲林路一段606號",
//   },
//   {
//     name: "一芳水果茶",
//     phone: "080123456",
//     city: "屏東縣",
//     district: "屏東市",
//     address: "中華路二段707號",
//   },
//   {
//     name: "茶本味",
//     phone: "041234567",
//     city: "彰化縣",
//     district: "彰化市",
//     address: "彰南路三段808號",
//   },
//   {
//     name: "卡旺卡",
//     phone: "072345678",
//     city: "高雄市",
//     district: "前鎮區",
//     address: "中華五路909號",
//   },
//   {
//     name: "胖老爹飲品",
//     phone: "063456789",
//     city: "臺南市",
//     district: "安平區",
//     address: "健康路二段101號",
//   },
//   {
//     name: "八珍水果茶",
//     phone: "024567890",
//     city: "新北市",
//     district: "永和區",
//     address: "永平路一段202號",
//   },
//   {
//     name: "甘蔗爸",
//     phone: "035678901",
//     city: "新竹市",
//     district: "北區",
//     address: "光復路二段303號",
//   }
// ];

// // 批量插入資料的函數
// async function insertData() {
//   try {
//     await shopModel.insertMany(shops);
//     console.log("資料插入成功");
//   } catch (error) {
//     console.error("資料插入失敗", error);
//   }
// }

// // 執行插入資料
// insertData();
