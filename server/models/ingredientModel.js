const mongoose = require('mongoose')
const baseSchemaFields = require('./baseSchemaFields');

const schema = new mongoose.Schema({
    name: { type: String, unique: true, required: [true, '名稱不得為空'] },
    icon: { type: String },
    price: { type: Number, required: [true, '價錢不得為空'] },
    ...baseSchemaFields
}, { timestamps: true })

module.exports = mongoose.model('Ingredient', schema)