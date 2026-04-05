import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useCart } from "../context/CartContext";
import "../Landing.css";

function Checkout() {
  const navigate = useNavigate();
  const { showToast, fetchCartCount } = useCart();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  useEffect(() => {
    document.title = "Checkout — BeliBilli";
    const fetchCart = async () => {
      try {
        const res = await API.get("/cart");
        setCart(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post("/orders", { shippingAddress: formData });
      fetchCartCount();
      showToast("Order placed successfully!");
      navigate(`/order-success?id=${res.data._id || "confirmed"}`);
    } catch (error) {
      console.error("Order Error:", error);
      showToast("Error placing order. Please check your details.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal =
    cart?.items?.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    ) || 0;

  return (
    <div className="container" style={{ paddingTop: "50px" }}>
      <h1 style={{ fontWeight: "800", marginBottom: "40px" }}>
        Secure Checkout
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.2fr",
          gap: "60px",
          marginBottom: "100px",
        }}
      >
        {/* Shipping Form */}
        <div>
          <h2
            style={{
              fontWeight: "800",
              fontSize: "1.4rem",
              marginBottom: "30px",
            }}
          >
            Shipping Information
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  color: "#666",
                }}
              >
                Street Address
              </label>
              <input
                name="address"
                required
                placeholder="123 Fashion St."
                onChange={handleChange}
                style={{
                  padding: "15px 20px",
                  borderRadius: "15px",
                  border: "1px solid #eee",
                  background: "#F8F9FA",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    color: "#666",
                  }}
                >
                  City
                </label>
                <input
                  name="city"
                  required
                  placeholder="New York"
                  onChange={handleChange}
                  style={{
                    padding: "15px 20px",
                    borderRadius: "15px",
                    border: "1px solid #eee",
                    background: "#F8F9FA",
                  }}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    color: "#666",
                  }}
                >
                  State
                </label>
                <input
                  name="state"
                  required
                  placeholder="NY"
                  onChange={handleChange}
                  style={{
                    padding: "15px 20px",
                    borderRadius: "15px",
                    border: "1px solid #eee",
                    background: "#F8F9FA",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    color: "#666",
                  }}
                >
                  Pincode
                </label>
                <input
                  name="pincode"
                  required
                  placeholder="10001"
                  onChange={handleChange}
                  style={{
                    padding: "15px 20px",
                    borderRadius: "15px",
                    border: "1px solid #eee",
                    background: "#F8F9FA",
                  }}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    color: "#666",
                  }}
                >
                  Phone Number
                </label>
                <input
                  name="phone"
                  required
                  placeholder="+1 234 567 890"
                  onChange={handleChange}
                  style={{
                    padding: "15px 20px",
                    borderRadius: "15px",
                    border: "1px solid #eee",
                    background: "#F8F9FA",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: "30px",
                padding: "20px",
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "50px",
                fontWeight: "800",
                fontSize: "1.1rem",
                cursor: "pointer",
              }}
            >
              Confirm & Pay ₹{subtotal.toFixed(2)}
            </button>
            {submitting && (
              <p
                style={{
                  textAlign: "center",
                  color: "#565959",
                  fontSize: "0.85rem",
                }}
              >
                Processing your order...
              </p>
            )}
          </form>
        </div>

        {/* Order Review */}
        <div
          style={{
            background: "#F8F9FA",
            borderRadius: "35px",
            padding: "40px",
            border: "1px solid #eee",
            height: "fit-content",
          }}
        >
          <h3 style={{ fontWeight: "800", marginBottom: "30px" }}>
            Order Review
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            {cart?.items?.map((item, idx) => (
              <div
                key={idx}
                style={{ display: "flex", gap: "15px", alignItems: "center" }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "60px",
                    background: "#fff",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    border: "1px solid #eee",
                  }}
                >
                  <img
                    src={
                      item.product?.images?.[0] || "https://placehold.co/100"
                    }
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/100?text=...";
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "700", fontSize: "0.9rem" }}>
                    {item.product.title}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#888" }}>
                    Qty: {item.quantity}
                  </div>
                </div>
                <span style={{ fontWeight: "700" }}>
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{ height: "1px", background: "#eee", margin: "25px 0" }}
          ></div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px",
              fontSize: "0.95rem",
            }}
          >
            <span style={{ color: "#666" }}>Subtotal</span>
            <span style={{ fontWeight: "700" }}>₹{subtotal.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px",
              fontSize: "0.95rem",
            }}
          >
            <span style={{ color: "#666" }}>Shipping</span>
            <span style={{ color: "#2DA44E", fontWeight: "800" }}>FREE</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "15px",
              fontWeight: "800",
              fontSize: "1.2rem",
            }}
          >
            <span>Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
