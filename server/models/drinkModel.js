const mongoose = require("mongoose");
const UploadService = require("../services/uploadService");
const baseSchemaFields = require('./baseSchemaFields');

const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "名稱不得為空"],
  },
  price: { type: Number, required: [true, "價格不得為空"], },
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Category",
    required: [true, "類別不得為空"],
  },
  images: {
    type: [
      {
        fileName: { type: String, required: [true, "檔案名稱不得為空"] },
        imgUrl: { type: String, required: [true, "圖片網址不得為空"] },
      },
    ],
  },
  hotCold: { type: String, required: [true, "冷熱不得為空"], },
  size: { type: String, required: [true, "大小不得為空"], },
  selling: { type: Boolean, required: [true, "請標示是否販售中"], },
  kal: { type: Number, required: [true, "卡路里不得為空"], },
  scores: {
    wom: { type: Number },
    store: { type: Number },
  },
  introduction: { type: String },
  alert: { type: String },
  ...baseSchemaFields
}, { timestamps: true });

schema.pre('deleteOne', { document: true, query: false }, async function () {
  try {
    if (this.images && this.images.length > 0) {
      const deletePromises = this.images.map(image =>
        UploadService.deleteImage(image.fileName)
      );

      await Promise.all(deletePromises);
    }
  } catch (error) {
    error.operation = error.operation || '圖片刪除';
    throw error;
  }
});

module.exports = mongoose.model("Drink", schema);
