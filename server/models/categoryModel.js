const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String, unique: [true, '名稱不得重複'], required: [true, '名稱不得為空'] },
    parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
}, { timestamps: true })

// schema.virtual('children',{
//     localField: '_id',
//     foreignField: 'parent',
//     justOne: false,
//     ref: 'Category'
// })

// schema.virtual('newsList',{
//     localField: '_id',
//     foreignField: 'categories',
//     justOne: false,
//     ref: 'Article'
// })

module.exports = mongoose.model('Category', schema)