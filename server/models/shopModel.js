const mongoose = require("mongoose");
const baseSchemaFields = require('./baseSchemaFields');

const schema = new mongoose.Schema({
    name: { type: String, unique: true, required: [true, '名稱不得為空'] },
    phone: { type: String, required: [true, '電話不得為空'] },
    city: { type: String, required: [true, '城市不得為空'] },
    district: { type: String, required: [true, '地區不得為空'] },
    address: { type: String, unique: true, required: [true, '地址不得為空'] },
    ...baseSchemaFields
}, { timestamps: true })

module.exports = mongoose.model("Shop", schema);
