const router = require("express").Router();

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

// Admin
router.post("/", authMiddleware, adminMiddleware, createProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

// Public
router.get("/", getProducts);
router.get("/:id", getProduct);

module.exports = router;