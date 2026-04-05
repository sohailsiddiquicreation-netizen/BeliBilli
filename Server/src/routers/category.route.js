const router = require("express").Router();

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

router.post("/", authMiddleware, adminMiddleware, createCategory);

router.get("/", getCategories);

router.put("/:id", authMiddleware, adminMiddleware, updateCategory);

router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;