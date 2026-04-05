import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useCart } from "../context/CartContext";
import "../Landing.css";

function Cart() {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();
  const { showToast, fetchCartCount } = useCart();

  const getCart = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      const guestCartData = JSON.parse(
        localStorage.getItem("guestCart") || "[]",
      );
      setCart({ items: guestCartData });
      return;
    }

    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (error) {
      console.log("Fetch cart error:", error);
    }
  };

  useEffect(() => {
    document.title = "Shopping Cart — BeliBeli.com";
    getCart();
  }, []);

  const removeItem = async (productId) => {
    const user = localStorage.getItem("user");
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const filtered = guestCart.filter(
        (item) => item.product._id !== productId,
      );
      localStorage.setItem("guestCart", JSON.stringify(filtered));
      getCart();
      return;
    }

    try {
      await API.delete("/cart", { data: { productId } });
      fetchCartCount();
      getCart();
    } catch (e) {
      showToast("Error removing item", "error");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    const user = localStorage.getItem("user");
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const item = guestCart.find((i) => i.product._id === productId);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        getCart();
      }
      return;
    }

    try {
      await API.put("/cart", { productId, quantity });
      fetchCartCount();
      getCart();
    } catch (e) {
      showToast("Error updating quantity", "error");
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div
        className="container"
        style={{ textAlign: "center", padding: "100px 0" }}
      >
        <span style={{ fontSize: "5rem" }}>🛒</span>
        <h2 style={{ fontWeight: "800", marginTop: "20px" }}>
          Your cart is empty
        </h2>
        <p style={{ color: "#888", marginBottom: "30px" }}>
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/products" className="hero-btn">
          Start Shopping
        </Link>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="container" style={{ paddingTop: "50px" }}>
      <h1 style={{ fontWeight: "800", marginBottom: "40px" }}>Shopping Cart</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "50px",
          marginBottom: "100px",
        }}
      >
        {/* Items List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {cart.items.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                gap: "25px",
                padding: "25px",
                borderRadius: "30px",
                background: "#F8F9FA",
                border: "1px solid #eee",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "140px",
                  background: "#fff",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: "1px solid #f0f0f0",
                }}
              >
                <img
                  src={item.product?.images?.[0] || "https://placehold.co/150"}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/150?text=Product";
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 10px 0", fontWeight: "800" }}>
                  {item.product.title}
                </h3>
                <span
                  style={{
                    color: "#8C8F9F",
                    fontSize: "0.9rem",
                    display: "block",
                    marginBottom: "15px",
                  }}
                >
                  Black | Size: M
                </span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity - 1)
                    }
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      border: "1px solid #ddd",
                      background: "white",
                      cursor: "pointer",
                      fontWeight: "800",
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: "700" }}>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity + 1)
                    }
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      border: "1px solid #ddd",
                      background: "white",
                      cursor: "pointer",
                      fontWeight: "800",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontWeight: "800",
                    fontSize: "1.4rem",
                    marginBottom: "30px",
                  }}
                >
                  ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                </div>
                <button
                  onClick={() => removeItem(item.product._id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#FF4B4B",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  REMOVE
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div
          style={{
            background: "#000",
            color: "#fff",
            borderRadius: "35px",
            padding: "40px",
            height: "fit-content",
            position: "sticky",
            top: "20px",
          }}
        >
          <h2 style={{ margin: "0 0 30px 0", fontWeight: "800" }}>
            Order Summary
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
              color: "#ccc",
              fontSize: "0.95rem",
            }}
          >
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
              color: "#ccc",
              fontSize: "0.95rem",
            }}
          >
            <span>Shipping</span>
            <span style={{ color: "#4BFFB2", fontWeight: "800" }}>FREE</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
              color: "#ccc",
              fontSize: "0.95rem",
            }}
          >
            <span>Discount (%)</span>
            <span>₹0.00</span>
          </div>
          <div
            style={{ height: "1px", background: "#333", margin: "30px 0" }}
          ></div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "40px",
              fontWeight: "800",
              fontSize: "1.5rem",
            }}
          >
            <span>Total</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            style={{
              width: "100%",
              padding: "20px",
              borderRadius: "50px",
              background: "#fff",
              color: "#000",
              border: "none",
              fontWeight: "800",
              fontSize: "1.1rem",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
          >
            Checkout Now
          </button>
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: "#666",
              fontSize: "0.8rem",
            }}
          >
            Secure payment powered by <b>Stripe</b>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
