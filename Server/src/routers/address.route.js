const router = require("express").Router();

const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/address.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, addAddress);

router.get("/", authMiddleware, getAddresses);

router.put("/:id", authMiddleware, updateAddress);

router.delete("/:id", authMiddleware, deleteAddress);

module.exports = router;