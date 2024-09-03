const categoryModel = require("../models/categoryModel");

module.exports = {
  createCategory: async (data) => {
    const category = new categoryModel(data);
    return await category.save();
  },

  getCategoriesWithPagination: async (options, query) => {
    const [categories, total] = await Promise.all([
      categoryModel.find(query).setOptions(options),
      categoryModel.countDocuments(query)
    ]);

    return { categories, total };
  },

  getAllCategories: async () => {
    return await categoryModel.find();
  },

  getCategoryById: async (id) => {
    return await categoryModel.findById(id);
  },

  updateCategory: async (id, data, options = {}) => {
    return await categoryModel.findByIdAndUpdate(id, data, options);
  },

  deleteCategory: async (id) => {
    return await categoryModel.findByIdAndDelete(id);
  },
};
