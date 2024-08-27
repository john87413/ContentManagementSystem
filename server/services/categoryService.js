const categoryModel = require('../models/categoryModel');

module.exports = {
    createCategory: async (data) => {
        const category = new categoryModel(data);
        return await category.save();
    },

    getCategories: async () => {
        const options = {
            populate: { path: 'parent' }
        };
        return await categoryModel.find().setOptions(options);
    },

    getCategoryById: async (id) => {
        return await categoryModel.findById(id);
    },

    updateCategory: async (id, data) => {
        return await categoryModel.findByIdAndUpdate(id, data, { new: true });
    },

    deleteCategory: async (id) => {
        return await categoryModel.findByIdAndDelete(id);
    }
};