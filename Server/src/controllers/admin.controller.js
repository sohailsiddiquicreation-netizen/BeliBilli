const User = require("../Models/user.model");
const Product = require("../Models/product.model");
const Order = require("../Models/order.model");
const Category = require("../Models/category.model");

// Dashboard Stats
const dashboard = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();
    const categories = await Category.countDocuments();

    // Calculate Total Revenue
    const revenueAggregation = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const revenue =
      revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    // Fetch Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user")
      .populate("items.product");

    res.json({
      users,
      products,
      orders,
      categories,
      revenue,
      recentOrders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.role = req.body.role || user.role;
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    await user.save();

    res.json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  dashboard,
  getUsers,
  updateUser,
  deleteUser,
};
