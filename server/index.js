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

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
