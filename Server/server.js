const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Database
const connectDB = require("./src/config/db");
connectDB();

// Routes
const authRouter = require("./src/routers/auth.route");
const productRoutes = require("./src/routers/product.route");
const categoryRoutes = require("./src/routers/category.route");
const cartRoutes = require("./src/routers/cart.route");
const orderRoutes = require("./src/routers/order.route");
const addressRoutes = require("./src/routers/address.route");
const adminRoutes = require("./src/routers/adimin.route");
const bannerRoutes = require("./src/routers/banner.route");

app.use("/api/admin", adminRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRouter);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
