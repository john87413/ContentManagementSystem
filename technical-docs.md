# 飲料店管理系統技術文檔 v1.0

## 1. 系統概述

### 1.1 系統定位
本系統是一個基於 Express.js 框架開發的飲料店後端管理系統，採用現代化的微服務架構設計，提供完整的飲品管理、門市管理、內容管理等功能。

### 1.2 技術棧選型
- **核心框架**: Express.js 4.19.2
- **數據庫**: MongoDB 8.5.4 + Mongoose ORM
- **文件存儲**: Firebase Storage 12.4.0
- **開發語言**: Node.js
- **API 規範**: RESTful

### 1.3 系統要求
- Node.js >= 14.0.0
- MongoDB >= 4.4
- Firebase 專案配置
- 支持 ES6+ 語法

## 2. 系統架構

### 2.1 整體架構
系統採用經典的三層架構，並加入服務層增強業務邏輯的封装性：
- 表現層（Controller Layer）
- 服務層（Service Layer）
- 數據層（Data Layer）

### 2.2 核心模組
```
server/
├── config/                 # 配置文件
│   ├── db.js              # 數據庫配置
│   └── firebase.js        # Firebase 配置
├── controllers/           # 控制器
│   ├── drinkController.js
│   ├── shopController.js
│   └── ...
├── services/             # 服務層
│   ├── drinkService.js
│   ├── shopService.js
│   └── ...
├── models/              # 數據模型
│   ├── drinkModel.js
│   ├── shopModel.js
│   └── ...
├── routes/             # 路由
│   ├── drinkRoutes.js
│   ├── shopRoutes.js
│   └── ...
├── middlewares/       # 中間件
│   ├── handleError.js
│   └── ...
└── index.js          # 應用入口
```

### 2.3 數據流向
1. HTTP 請求進入系統
2. 路由層處理請求分發
3. 中間件層處理通用邏輯
4. 控制器層處理請求轉換
5. 服務層處理業務邏輯
6. 數據層處理數據存取
7. 響應返回客戶端

## 3. 核心模組設計

### 3.1 Routes Layer 設計模式
```javascript
// 模組化路由結構
routes/
├── index.js                # 路由統一入口
├── articleRoutes.js        # 文章相關路由
├── carouselRoutes.js       # 輪播圖相關路由
├── categoryRoutes.js       # 分類相關路由
├── drinkRoutes.js         # 飲品相關路由
├── ingredientRoutes.js     # 配料相關路由
├── shopRoutes.js          # 商店相關路由
└── uploadRoute.js         # 文件上傳路由
```

統一的路由註冊模式：
```javascript
router.use('/rest/categories', categoryRoutes);
router.use('/rest/ingredients', ingredientRoutes);
router.use('/rest/shops', shopRoutes);
// ... 其他路由註冊
```

所有資源都遵循統一的 RESTful 路由設計：

```javascript
const express = require('express');
const router = express.Router();

// 資源路由模式
router.post('/', Controller.create);
router.get('/', Controller.getList);
router.get('/:id', Controller.getById);
router.put('/:id', Controller.update);
router.delete('/:id', Controller.delete);
```

### 3.2 Controller Layer 設計
控制器層統一處理請求和響應：
```javascript
// 控制器範例結構
class BaseController {
  constructor(service) {
    this.service = service;
  }

  // 標準 CRUD 操作模板方法
  async create(req, res, next) {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
  // ... 其他方法
}
```

特點：
- 依賴注入設計模式
- 統一的錯誤處理
- 標準化的響應格式(Response)
- 請求參數驗證
- 業務邏輯分發

### 3.3 Service Layer 設計模式
核心業務邏輯封裝：
```javascript
class BaseService {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const instance = new this.model(data);
    return await instance.save();
  }

  async getWithPagination(options, query) {
    const [items, total] = await Promise.all([
      this.model.find(query).setOptions(options),
      this.model.countDocuments(query)
    ]);
    return { items, total };
  }
  // ... 其他方法
}
```

特點：
- 業務邏輯集中管理
- 數據庫操作封裝
- 事務管理

### 3.4 Model Layer 設計
採用 Mongoose Schema 定義數據模型，包含：
- 字段驗證
- 錯誤處理
- 關聯關係
- 中間件處理
- 虛擬字段

各模型都實現了完整的數據驗證和關聯關係：
```javascript
// 飲品模型示例
const drinkSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, "名稱不得重複"],
    required: [true, "名稱不得為空"],
  },
  price: { 
    type: Number, 
    required: [true, "價格不得為空"], 
  },
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Category",
    required: [true, "類別不得為空"],
  },
  images: [{
    fileName: { type: String, required: true },
    imgUrl: { type: String, required: true }
  }],
  hotCold: { type: String, required: true },
  size: { type: String, required: true },
  selling: { type: Boolean, required: true },
  kal: { type: Number, required: true },
  scores: {
    wom: { type: Number },
    store: { type: Number }
  }
}, { 
  timestamps: true 
});
```

實現了多個模型之間的關聯關係：
```javascript
// 輪播圖與文章的關聯
const carouselSchema = new mongoose.Schema({
  name: {
    type: String, 
    unique: [true, "名稱不得重複"], 
    required: [true, "名稱不得為空"],
  },
  articles: {
    type: [{
      article: { 
        type: mongoose.SchemaTypes.ObjectId, 
        ref: "Article" 
      }
    }],
    required: [true, "文章不得為空"],
  }
});
```

## 4. 文件處理

### 4.1 上傳流程
1. 客戶端發起上傳請求
2. Multer 中間件處理文件
3. 上傳至 Firebase Storage
4. 返回文件訪問 URL

整合了 Firebase Storage 的文件上傳服務：

```javascript
class UploadService {
  constructor() {
    this.bucket = firebaseAdmin.storage().bucket();
  }

  // 上傳圖片
  uploadImages = async (files) => {
    const uploadPromises = files.map(async (file) => {
      const fileName = `${uuidv4()}.${
        file.originalname.split('.').pop()
      }`;
      const blob = this.bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          cacheControl: 'public, max-age=86400',
        },
      });

      try {
        await new Promise((resolve, reject) => {
          blobStream.on('finish', resolve);
          blobStream.on('error', reject);
          blobStream.end(file.buffer);
        });

        const imgUrl = `https://firebasestorage.googleapis.com/v0/b/${
          process.env.FIREBASE_PROJECT_ID
        }.appspot.com/o/${encodeURIComponent(fileName)}?alt=media`;
        
        return { fileName, imgUrl };
      } catch (error) {
        throw new Error('上傳或取得圖片URL失敗');
      }
    });

    return Promise.all(uploadPromises);
  }

  // 刪除圖片
  deleteImage = async (fileName) => {
    try {
      const blob = this.bucket.file(fileName);
      await blob.delete();
      return '刪除成功';
    } catch (error) {
      throw new Error('刪除圖片失敗');
    }
  }
}
```

### 4.2 文件上傳中間件
實現了文件上傳的驗證和處理：

```javascript
const upload = multer({
  limits: { 
    fileSize: 5 * 1024 * 1024  // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('只允許上傳圖片檔案'));
    }
    cb(null, true);
  },
});
```

## 5. 安全性設計

### 5.1 數據驗證
- 使用 Mongoose Schema 驗證
- API 參數驗證
- 文件類型驗證
- 業務邏輯驗證

### 5.2 錯誤處理
實現了全局的錯誤處理中間件：
```javascript
const handleError = (error, req, res, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        // 處理唯一索引衝突
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        const errorMessages = `'${value}'已存在，不得重複`;
        res.status(400).json({ message: errorMessages });
    } else if (error.name === 'ValidationError') {
        // 處理驗證錯誤
        const errorMessages = Object.values(error.errors)
            .map(err => err.message)
            .join(', ');
        res.status(400).json({ message: errorMessages });
    } else {
        // 處理其他錯誤
        res.status(400).json({ 
            message: error.message || "An unexpected error occurred" 
        });
    }
};
```
