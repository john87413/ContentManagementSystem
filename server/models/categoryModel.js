const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String, unique: true, required: [true, '名稱不得為空'] },
    parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
}, { timestamps: true })

module.exports = mongoose.model('Category', schema)