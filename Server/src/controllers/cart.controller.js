const Cart = require("../Models/cart.model");
const Product = require("../Models/product.model");

// Add to Cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId,
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    res.json({
      message: "Added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get Cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
    );

    res.json(cart);
  } catch (error) {
    console.error("Cart error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Remove from Cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    res.json({
      message: "Removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update Quantity
const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (item) {
      item.quantity = quantity;
    }

    await cart.save();

    res.json({
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
};
