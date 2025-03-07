const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, '名稱不得重複'],
    required: [true, '名稱不得為空'],
    minlength: [3, '帳號至少需要3個字符']
  },
  password: {
    type: String,
    required: [true, '密碼不得為空'],
    select: false,
    minlength: [6, '密碼至少需要6個字符'], // 添加最小長度驗證
    set(val) {
      return require("bcryptjs").hashSync(val, 10);
    },
  },
  role: {
    type: String,
    enum: [
      'superAdmin',     // 超級管理員
      'contentManager', // 內容管理員
      'marketingManager', // 行銷管理員
      'systemAdmin'     // 系統管理員
    ],
    default: 'contentManager'
  },
  permissions: {
    contentManagement: {
      type: Boolean,
      default: false
    },
    marketingManagement: {
      type: Boolean,
      default: false
    },
    systemSettings: {
      type: Boolean,
      default: false
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("User", schema);