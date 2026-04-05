const router = require("express").Router();

const {
  dashboard,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/admin.controller");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

router.get("/dashboard", authMiddleware, adminMiddleware, dashboard);

router.get("/users", authMiddleware, adminMiddleware, getUsers);

router.put("/users/:id", authMiddleware, adminMiddleware, updateUser);

router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
