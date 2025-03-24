const mongoose = require("mongoose");

const baseSchemaFields = {
    isProtected: {
        type: Boolean,
        default: false,
        description: "受保護的資料不能被編輯或刪除"
    },
    updatedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        description: "最後更新操作的用戶"
    }
};

module.exports = baseSchemaFields;