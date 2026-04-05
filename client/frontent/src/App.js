import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
// components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { RequireAuth, RequireAdmin } from "./components/ProtectedRoute";
// public pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";
// admin pages
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import AdminLayout from "./pages/admin/AdminLayout";
import AddProduct from "./pages/admin/AddProduct";
import AdminCategories from "./pages/admin/Categories";
import EditProduct from "./pages/admin/EditProduct";
import BannerManager from "./pages/admin/BannerManager";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Auth-protected routes */}
          <Route
            path="/cart"
            element={
              <RequireAuth redirectTo="/login?redirect=cart">
                <Cart />
              </RequireAuth>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth redirectTo="/login?redirect=checkout">
                <Checkout />
              </RequireAuth>
            }
          />
          <Route
            path="/orders"
            element={
              <RequireAuth redirectTo="/login?redirect=orders">
                <Orders />
              </RequireAuth>
            }
          />
          <Route
            path="/order-success"
            element={
              <RequireAuth redirectTo="/login">
                <OrderSuccess />
              </RequireAuth>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="categories" element={<AdminCategories />} />
           
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<Users />} />
            <Route path="banners" element={<BannerManager />} />
          </Route>

          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
