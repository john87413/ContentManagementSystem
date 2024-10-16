class CategoryController {
  constructor(categoryService) {
    this.categoryService = categoryService;
  }

  createCategory = async (req, res, next) => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  getCategories = async (req, res, next) => {
    try {
      const { page, limit, nameQuery = '' } = req.query;
      if (page && limit) {
        const options = {
          populate: { path: "parent" },
          skip: (parseInt(page) - 1) * parseInt(limit),
          limit: parseInt(limit),
        };
        const query = nameQuery ? { name: new RegExp(nameQuery, 'i') } : {};
        const paginatedCategories = await this.categoryService.getCategoriesWithPagination(options, query);
        res.json(paginatedCategories);
      } else {
        const categories = await this.categoryService.getAllCategories();
        res.json(categories);
      }
    } catch (error) {
      next(error);
    }
  }

  getCategoryById = async (req, res, next) => {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  updateCategory = async (req, res, next) => {
    try {
      const category = await this.categoryService.updateCategory(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  deleteCategory = async (req, res, next) => {
    try {
      const result = await this.categoryService.deleteCategory(req.params.id);
      if (!result) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json({ message: 'Category deleted' });
    } catch (error) {
      next(error);
    }
  }
}

const categoryService = require("../services/categoryService");
module.exports = new CategoryController(categoryService);
