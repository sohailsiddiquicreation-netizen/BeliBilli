const mongoose = require("mongoose");
const Cart = require("./src/Models/cart.model");

mongoose.connect("mongodb://localhost:27017/Ecommerce").then(async () => {
  try {
    const carts = await Cart.find({});
    console.log(JSON.stringify(carts, null, 2));
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
});
