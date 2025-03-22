const baseSchemaFields = {
    isProtected: {
        type: Boolean,
        default: false,
        description: "受保護的資料不能被編輯或刪除"
    }
};

module.exports = baseSchemaFields;