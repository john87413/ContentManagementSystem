const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, "名稱不得重複"],
    required: [true, "名稱不得為空"],
  },
  items: {
    type: [
      {
        article: { type: mongoose.SchemaTypes.ObjectId, ref: "Article" },
        image: {
          name: { type: String },
          url: { type: String },
        },
      },
    ],
    required: [true, "文章不得為空"],
  },
});
