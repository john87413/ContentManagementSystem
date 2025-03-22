const mongoose = require('mongoose')
const baseSchemaFields = require('./baseSchemaFields');

const schema = new mongoose.Schema({
    name: { type: String, unique: true, required: [true, '名稱不得為空'] },
    parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
    ...baseSchemaFields
}, { timestamps: true })

module.exports = mongoose.model('Category', schema)