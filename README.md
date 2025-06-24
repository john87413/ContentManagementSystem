# 內容管理系統 (Content Management System)

此專案為飲料店內容管理系統，採用前後端分離架構設計。整合 Vue 3 Composition API 與 Element Plus UI 框架打造的前端管理介面，搭配 Node.js/Express 建構的 RESTful API 後端，並使用 MongoDB 資料庫與 Firebase Storage 作為儲存解決方案。系統提供飲品與配料管理、門市據點維護、行銷內容發布與基於角色的使用者權限控制功能。

[Demo Link](https://cms-psi-mauve.vercel.app/)

[English Documentation](#english-documentation)

## 📋 目錄

- [系統概述](#🔍-系統概述)
- [功能特色](#✨-功能特色)
- [技術stack](#🛠-技術stack)
- [系統架構](#🏗-系統架構)
- [安裝與執行](#🚀-安裝與執行)
- [API 文件](#📖-api-文件)
- [部署](#🌐-部署)

## 🔍 系統概述

飲料店管理系統是一個專為飲料連鎖店設計的內容管理平台，用於管理菜單、配料、門市、行銷內容等資訊。系統具備完整的使用者權限管理，依據不同角色（內容管理員、行銷管理員、系統管理員）分配不同操作權限，確保系統安全性與資料完整性。

## ✨ 功能特色

### 內容管理
- **飲品管理**：新增、編輯、刪除飲品項目，設定價格、熱量、冷熱選項等
- **分類管理**：建立分層分類結構，靈活組織菜單
- **配料管理**：維護配料資訊及附加價格

### 行銷管理
- **輪播圖管理**：建立首頁或APP輪播廣告，關聯至特定文章
- **文章管理**：撰寫宣傳文章，支援圖文編輯器
- **門市管理**：管理全台門市資訊，包含地址、電話等

### 系統管理
- **使用者管理**：建立與維護系統操作者帳號
- **權限控制**：基於角色的存取控制系統(RBAC)
- **圖片上傳**：整合 Firebase Storage 的圖片管理功能

## 🛠 技術stack

### 前端 (Admin)
- **框架**: Vue 3.4.x (Composition API)
- **路由**: Vue Router 4.3.x
- **狀態管理**: Pinia 2.1.x
- **UI 元件**: Element Plus 2.7.x
- **HTTP 客戶端**: Axios 1.7.x
- **圖片處理**: browser-image-compression 2.0.x
- **文字編輯器**: Quill 2.0.x
- **建置工具**: Vite 6.2.x

### 後端 (Server)
- **執行環境**: Node.js 18.x
- **框架**: Express 4.19.x
- **資料庫**: MongoDB 8.5.x (Mongoose ODM)
- **認證**: JWT (jsonwebtoken 9.0.x)
- **密碼加密**: bcryptjs 3.0.x
- **檔案處理**: Multer 1.4.x
- **雲端儲存**: Firebase Storage (firebase-admin 12.4.x)

### 部署
- **平台**: Vercel

## 🏗 系統架構

```
project-root/
├── admin/                 # 前端 Vue 應用
│   ├── public/            # 靜態資源
│   ├── src/               # 原始碼
│   │   ├── api/           # API 呼叫封裝
│   │   ├── assets/        # 圖片等靜態資源
│   │   ├── components/    # 可重複使用元件
│   │   ├── router/        # 路由設定
│   │   ├── stores/        # Pinia 狀態管理
│   │   ├── utils/         # 工具函數
│   │   └── views/         # 頁面元件
│   └── ...
│
├── server/                # 後端 Node.js 應用
│   ├── config/            # 設定檔
│   ├── controllers/       # 控制器
│   ├── errors/            # 錯誤處理類
│   ├── middlewares/       # 中介軟體
│   ├── models/            # MongoDB 模型
│   ├── routes/            # 路由定義
│   ├── services/          # 業務邏輯層
│   └── ...
│
└── vercel.json            # Vercel 部署設定
```

## 🚀 安裝與執行

### 前置條件
- Node.js 18.x 或更高版本
- MongoDB 5.x 或更高版本
- Firebase 專案（用於圖片儲存）

### 後端設定

1. 進入伺服器目錄：
```bash
cd server
```

2. 安裝套件：
```bash
npm install
```

3. 建立 `.env` 檔案並設定：
```
PORT=3000
DB_CONNECTION_STRING=mongodb://localhost:27017/beverage-shop
JWT_SECRET=your_jwt_secret_key

# Firebase 設定
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-cert-url
```

4. 啟動伺服器：
```bash
npm run serve
```

### 前端設定

1. 進入管理面板目錄：
```bash
cd admin
```

2. 安裝套件：
```bash
npm install
```

3. 建立 `.env` 檔案：
```
VITE_API_URL=http://localhost:3000/api
```

4. 啟動開發伺服器：
```bash
npm run dev
```

5. 打包正式版本：
```bash
npm run build
```

## 📖 API 文件

系統提供完整的RESTful API，主要端點分類如下：

### 使用者與認證
| 端點                             | 方法   | 描述           | 權限                              |
| -------------------------------- | ------ | -------------- | --------------------------------- |
| `/api/rest/users/login`          | POST   | 使用者登入     | 無需權限                          |
| `/api/rest/users/validate-token` | GET    | 驗證JWT令牌    | 任何登入用戶                      |
| `/api/rest/users`                | POST   | 建立新使用者   | 無需權限(註冊)/系統設定權限(管理) |
| `/api/rest/users`                | GET    | 取得使用者列表 | 系統設定權限                      |
| `/api/rest/users/:id`            | GET    | 取得特定使用者 | 系統設定權限                      |
| `/api/rest/users/:id`            | PUT    | 更新使用者資料 | 系統設定權限                      |
| `/api/rest/users/:id`            | DELETE | 刪除使用者     | 系統設定權限                      |

### 內容管理 (需內容管理權限)
| 端點                        | 方法   | 描述         |
| --------------------------- | ------ | ------------ |
| `/api/rest/categories`      | GET    | 取得分類列表 |
| `/api/rest/categories/:id`  | GET    | 取得特定分類 |
| `/api/rest/categories`      | POST   | 建立新分類   |
| `/api/rest/categories/:id`  | PUT    | 更新分類     |
| `/api/rest/categories/:id`  | DELETE | 刪除分類     |
| `/api/rest/drinks`          | GET    | 取得飲品列表 |
| `/api/rest/drinks/:id`      | GET    | 取得特定飲品 |
| `/api/rest/drinks`          | POST   | 建立新飲品   |
| `/api/rest/drinks/:id`      | PUT    | 更新飲品     |
| `/api/rest/drinks/:id`      | DELETE | 刪除飲品     |
| `/api/rest/ingredients`     | GET    | 取得配料列表 |
| `/api/rest/ingredients/:id` | GET    | 取得特定配料 |
| `/api/rest/ingredients`     | POST   | 建立新配料   |
| `/api/rest/ingredients/:id` | PUT    | 更新配料     |
| `/api/rest/ingredients/:id` | DELETE | 刪除配料     |

### 行銷管理 (需行銷管理權限)
| 端點                      | 方法   | 描述           |
| ------------------------- | ------ | -------------- |
| `/api/rest/articles`      | GET    | 取得文章列表   |
| `/api/rest/articles/:id`  | GET    | 取得特定文章   |
| `/api/rest/articles`      | POST   | 建立新文章     |
| `/api/rest/articles/:id`  | PUT    | 更新文章       |
| `/api/rest/articles/:id`  | DELETE | 刪除文章       |
| `/api/rest/shops`         | GET    | 取得門市列表   |
| `/api/rest/shops/:id`     | GET    | 取得特定門市   |
| `/api/rest/shops`         | POST   | 建立新門市     |
| `/api/rest/shops/:id`     | PUT    | 更新門市       |
| `/api/rest/shops/:id`     | DELETE | 刪除門市       |
| `/api/rest/carousels`     | GET    | 取得輪播圖列表 |
| `/api/rest/carousels/:id` | GET    | 取得特定輪播圖 |
| `/api/rest/carousels`     | POST   | 建立新輪播圖   |
| `/api/rest/carousels/:id` | PUT    | 更新輪播圖     |
| `/api/rest/carousels/:id` | DELETE | 刪除輪播圖     |

### 檔案上傳 (需內容或行銷管理權限)
| 端點                           | 方法   | 描述     |
| ------------------------------ | ------ | -------- |
| `/api/upload/images`           | POST   | 上傳圖片 |
| `/api/upload/images/:fileName` | DELETE | 刪除圖片 |

## 🌐 部署

### Vercel 部署

本專案已設定 Vercel 部署方案，透過 `vercel.json` 檔案設定前後端整合部署：

1. 安裝 Vercel CLI：
```bash
npm install -g vercel
```

2. 登入 Vercel：
```bash
vercel login
```

3. 部署專案：
```bash
vercel --prod
```

---

# English Documentation

## Beverage Shop Management System

A comprehensive content management system (CMS) for beverage shops, offering drink, ingredient, and store management features. Built with a decoupled architecture using Vue 3 for the frontend admin interface and Node.js/Express for the RESTful API backend service.

## System Overview

The Beverage Shop Management System is a content management platform designed for beverage chain stores to manage menus, ingredients, store locations, and marketing content. The system features complete user permission management, assigning different operational permissions based on roles (content manager, marketing manager, system administrator) to ensure system security and data integrity.

## Key Features

### Content Management
- **Drink Management**: Add, edit, and delete drink items, set prices, calories, hot/cold options, etc.
- **Category Management**: Build layered category structures for flexible menu organization
- **Ingredient Management**: Maintain ingredient information and additional pricing

### Marketing Management
- **Carousel Management**: Create homepage or app carousel advertisements linked to specific articles
- **Article Management**: Write promotional articles with support for rich text editing
- **Store Management**: Manage store information across Taiwan, including addresses and phone numbers

### System Management
- **User Management**: Create and maintain system operator accounts
- **Access Control**: Role-based access control system (RBAC)
- **Image Upload**: Image management with Firebase Storage integration

## Tech Stack

### Frontend (Admin)
- **Framework**: Vue 3.4.x (Composition API)
- **Routing**: Vue Router 4.3.x
- **State Management**: Pinia 2.1.x
- **UI Components**: Element Plus 2.7.x
- **HTTP Client**: Axios 1.7.x
- **Image Processing**: browser-image-compression 2.0.x
- **Rich Text Editor**: Quill 2.0.x
- **Build Tool**: Vite 6.2.x

### Backend (Server)
- **Runtime**: Node.js 18.x
- **Framework**: Express 4.19.x
- **Database**: MongoDB 8.5.x (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken 9.0.x)
- **Password Encryption**: bcryptjs 3.0.x
- **File Handling**: Multer 1.4.x
- **Cloud Storage**: Firebase Storage (firebase-admin 12.4.x)

