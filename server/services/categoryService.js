class CategoryService {
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  createCategory = async (data) => {
    const category = new this.categoryModel(data);
    return await category.save();
  }

  getCategoriesWithPagination = async (options, query) => {
    const [categories, total] = await Promise.all([
      this.categoryModel.find(query).setOptions(options),
      this.categoryModel.countDocuments(query),
    ]);

    return { categories, total };
  }

  getAllCategories = async () => {
    return await this.categoryModel.find();
  }

  getCategoryById = async (id) => {
    return await this.categoryModel.findById(id);
  }

  updateCategory = async (id, data, options = {}) => {
    return await this.categoryModel.findByIdAndUpdate(id, data, { new: true, ...options });
  }

  deleteCategory = async (id) => {
    const category = await this.categoryModel.findById(id);
    if (category) {
      await category.deleteOne();
    }
    return category;
  }
}

const categoryModel = require("../models/categoryModel");
module.exports = new CategoryService(categoryModel);