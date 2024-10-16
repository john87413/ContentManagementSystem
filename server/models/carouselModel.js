const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String, unique: [true, "名稱不得重複"], required: [true, "名稱不得為空"],
  },
  articles: {
    type: [{ article: { type: mongoose.SchemaTypes.ObjectId, ref: "Article" }, },],
    required: [true, "文章不得為空"],
  },
}, { timestamps: true });

module.exports = mongoose.model("Carousel", schema);
