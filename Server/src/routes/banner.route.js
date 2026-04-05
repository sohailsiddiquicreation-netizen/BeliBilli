const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/banner.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

// Public route to get all banners for homepage
router.get("/", bannerController.getAllBanners);

// Admin routes to manage banners
router.post("/", verifyToken, isAdmin, bannerController.createBanner);
router.delete("/:id", verifyToken, isAdmin, bannerController.deleteBanner);

module.exports = router;
