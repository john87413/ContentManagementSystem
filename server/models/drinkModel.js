const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, "名稱不得重複"],
    required: [true, "名稱不得為空"],
  },
  price: { type: Number, required: true },
  categories: {
    type: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    required: [true, "類別不得為空"],
  },
  images: {
    type: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],
  },
  hotCold: { type: String, required: true },
  amount: { type: String, required: true },
  selling: { type: Boolean, required: true },
  kal: { type: Number, required: true },
  scores: {
    wom: { type: Number },
    store: { type: Number },
  },
  introduction: { type: String },
  alert: { type: String },
});

module.exports = mongoose.model("Drink", schema);
