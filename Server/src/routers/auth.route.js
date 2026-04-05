const router = require("express").Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
  res.json({ message: "Logged out" });
});

module.exports = router;
