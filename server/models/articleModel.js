const mongoose = require("mongoose");
const UploadService = require("../services/uploadService");

const schema = new mongoose.Schema({
  title: { type: String, unique: [true, '標題不得重複'], required: [true, '標題不得為空'] },
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Category",
    required: [true, "類別不得為空"],
  },
  image: {
    type: {
      fileName: { type: String },
      imgUrl: { type: String },
    },
  },
  content: { type: String },
}, { timestamps: true });

schema.pre('deleteOne', { document: true, query: false }, async function () {
  try {
    if (this.image && this.image.fileName) {
      await UploadService.deleteImage(this.image.fileName);
    }
  } catch (error) {
    error.operation = error.operation || '圖片刪除';
    throw error;
  }
});

module.exports = mongoose.model("Article", schema);