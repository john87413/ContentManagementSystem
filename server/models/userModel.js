const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, '名稱不得重複'],
    required: [true, '名稱不得為空']
  },
  password: {
    type: String,
    required: [true, '密碼不得為空'],
    select: false,
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

// 根據角色自動設置權限
schema.pre('save', function(next) {
  switch(this.role) {
    case 'superAdmin':
      this.permissions.contentManagement = true;
      this.permissions.marketingManagement = true;
      this.permissions.systemSettings = true;
      break;
    case 'contentManager':
      this.permissions.contentManagement = true;
      break;
    case 'marketingManager':
      this.permissions.marketingManagement = true;
      break;
    case 'systemAdmin':
      this.permissions.systemSettings = true;
      break;
    default:
      break;
  }
  next();
});

module.exports = mongoose.model("User", schema);