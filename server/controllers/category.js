const Category = require("../models/Category");

module.exports = {
  getCategories: async (req, res) => {
    try {
      const items = await Category.find({
        restaurantId: req.query.restId,
      });
      res.json(items);
    } catch (err) {
      res.json({ message: err });
    }
  },
  createCategory: async (req, res) => {
    const category = new Category({
      name: req.body.name,
      items: req.body.items,
      restaurantId: req.body.restaurantId,
    });

    try {
      const savedCategory = await category.save();
      res.json(savedCategory);
    } catch (err) {
      res.json({ message: err });
    }
  },
  findCategory: async (req, res) => {
    try {
      const category = await Category.findById(req.params.categoryId);
      res.json(category);
    } catch (err) {
      res.json({ message: err });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const category = await Category.deleteOne({ _id: req.params.categoryId });
      res.json(category);
    } catch (err) {
      res.json({ message: err });
    }
  },
  updateCategory: async (req, res, next) => {
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.categoryId,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(category);
    } catch (err) {
      next(err);
    }
  },
};
