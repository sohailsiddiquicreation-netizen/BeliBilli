const router = require("express").Router();

const {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrder,
} = require("../controllers/order.controller");

const authMiddleware = require("../middleware/auth.middleware");
const optionalAuthMiddleware = require("../middleware/optionalAuth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

router.post("/", optionalAuthMiddleware, createOrder);

router.get("/my", authMiddleware, getMyOrders);

router.get("/", authMiddleware, adminMiddleware, getOrders);

router.put("/:id", authMiddleware, adminMiddleware, updateOrder);

module.exports = router;
