const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: { type: String, unique: [true, '名稱不得重複'], required: [true, '名稱不得為空'] },
    phone: { type: String, required: [true, '電話不得為空'] },
    city: { type: String, required: [true, '城市不得為空'] },
    district: { type: String, required: [true, '地區不得為空'] },
    address: { type: String, unique: [true, '地址不得重複'], required: [true, '地址不得為空'] },
}, { timestamps: true })

module.exports = mongoose.model("Shop", schema);
