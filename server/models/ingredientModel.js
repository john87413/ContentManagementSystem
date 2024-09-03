const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String, unique: [true, '名稱不得重複'], required: [true, '名稱不得為空'] },
    icon: { type: String },
    price: { type: Number, required: [true, '價錢不得為空'] },
}, { timestamps: true })

module.exports = mongoose.model('Ingredient', schema)