const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    guestEmail: {
      type: String,
      required: false,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        quantity: Number,

        price: Number,
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    shippingAddress: {
      address: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },

    paymentStatus: {
      type: String,
      default: "pending",
    },

    orderStatus: {
      type: String,
      default: "processing",
    },
  },
  { timestamps: true },
);
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
