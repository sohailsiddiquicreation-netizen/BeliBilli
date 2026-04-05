const Category = require("../Models/category.model");

// Create Category (Admin)
const createCategory = async (req, res) => {
  try {
    const { name, description, parent } = req.body;

    const category = await Category.create({
      name,
      description,
      parent: parent || null,
    });

    res.status(201).json({
      message: "Category created",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('parent', 'name');

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update Category (Admin)
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Category updated",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Delete Category (Admin)
const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.json({
      message: "Category deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};