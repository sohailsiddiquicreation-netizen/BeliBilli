const router = require("express").Router();

const {
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
} = require("../controllers/cart.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, addToCart);

router.get("/", authMiddleware, getCart);

router.delete("/", authMiddleware, removeFromCart);

router.put("/", authMiddleware, updateCart);

module.exports = router;