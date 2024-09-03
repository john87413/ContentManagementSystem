const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: { type: String, unique: [true, '標題不得重複'], required: [true, '標題不得為空'] },
  categories: {
    type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Category" }],
    required: true,
  },
  images: {
    type: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],
  },
  body: { type: String },
});

module.exports = mongoose.model("Article", schema);