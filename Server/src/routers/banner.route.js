const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/banner.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

// Public route to get all banners for homepage
router.get("/", bannerController.getAllBanners);

// Admin routes to manage banners
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  bannerController.createBanner,
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  bannerController.deleteBanner,
);

module.exports = router;
