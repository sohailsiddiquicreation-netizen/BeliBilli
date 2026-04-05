const Order = require("../Models/order.model");
const Cart = require("../Models/cart.model");

// Create Order
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, guestItems, guestEmail } = req.body;
    let items = [];
    let totalPrice = 0;
    let userId = req.user ? req.user.id : null;

    if (userId) {
      // Logic for Logged in User
      const cart = await Cart.findOne({ user: userId }).populate(
        "items.product",
      );
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      items = cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      totalPrice = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
      await Cart.findOneAndDelete({ user: userId });
    } else {
      // Logic for Guest User
      if (!guestItems || guestItems.length === 0) {
        return res
          .status(400)
          .json({ message: "No items provided for guest order" });
      }
      if (!guestEmail) {
        return res.status(400).json({ message: "Guest email is required" });
      }

      items = guestItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      }));

      totalPrice = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
    }

    const order = await Order.create({
      user: userId,
      guestEmail: guestEmail || null,
      items,
      totalPrice,
      shippingAddress,
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ message: "Server error during order creation" });
  }
};

// Get My Orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "items.product",
    );

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get All Orders (Admin)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update Order Status (Admin)
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      message: "Order updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrder,
};
