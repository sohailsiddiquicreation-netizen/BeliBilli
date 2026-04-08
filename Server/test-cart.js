const mongoose = require("mongoose");
const Cart = require("./src/Models/cart.model");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const carts = await Cart.find({});
    console.log(JSON.stringify(carts, null, 2));
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
});
