import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { useCart } from "../context/CartContext";
import "../Landing.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("shipping");
  const [loading, setLoading] = useState(true);
  const { showToast } = useCart();

  useEffect(() => {
    document.title = "Your Orders — BeliBeli.com";
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/my");
        setOrders(res.data);
      } catch (error) {
        console.error("Fetch orders failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "shipping")
      return (
        order.orderStatus !== "delivered" &&
        order.orderStatus !== "cancelled" &&
        order.orderStatus !== "canceled"
      );
    if (activeTab === "arrived") return order.orderStatus === "delivered";
    if (activeTab === "canceled")
      return (
        order.orderStatus === "cancelled" || order.orderStatus === "canceled"
      );
    return true;
  });

  const getProductImage = (item) => {
    if (item.product?.images?.[0]) return item.product.images[0];
    return "https://placehold.co/150?text=Product+Image";
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "100px", color: "#555" }}>
        <div style={{ fontSize: "2rem", marginBottom: "15px" }}>⏳</div>
        <p>Loading your orders...</p>
      </div>
    );

  return (
    <div
      className="container"
      style={{
        paddingTop: "30px",
        background: "#f6f8fb",
        minHeight: "100vh",
        maxWidth: "100%",
        width: "100%",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px" }}>
        <h1
          style={{
            fontWeight: "800",
            fontSize: "1.8rem",
            marginBottom: "20px",
          }}
        >
          Your Orders
        </h1>

        {/* Tabs - Amazon Style */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "25px",
            borderBottom: "1px solid #ddd",
          }}
        >
          {["shipping", "arrived", "canceled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 10px 15px 10px",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? "3px solid #FF9900" : "none",
                fontWeight: activeTab === tab ? "800" : "600",
                textTransform: "capitalize",
                color: activeTab === tab ? "#111" : "#565959",
                cursor: "pointer",
                fontSize: "0.95rem",
              }}
            >
              {tab === "shipping"
                ? "Orders"
                : tab === "arrived"
                  ? "Delivered"
                  : "Cancelled"}
            </button>
          ))}
        </div>

        {/* Order Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                style={{
                  border: "1px solid #D5D9D9",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                {/* Card Header (Gray strip) */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "15px 20px",
                    background: "#F0F2F2",
                    borderBottom: "1px solid #D5D9D9",
                    fontSize: "0.8rem",
                    color: "#565959",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}
                  >
                    <div>
                      <span
                        style={{ display: "block", textTransform: "uppercase" }}
                      >
                        Order Placed
                      </span>
                      <span style={{ fontWeight: "700", color: "#111" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{ display: "block", textTransform: "uppercase" }}
                      >
                        Total
                      </span>
                      <span style={{ fontWeight: "700", color: "#111" }}>
                        ₹{order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{ display: "block", textTransform: "uppercase" }}
                      >
                        Ship To
                      </span>
                      <span
                        style={{
                          fontWeight: "700",
                          color: "#007185",
                          cursor: "pointer",
                        }}
                        title={order.shippingAddress?.address}
                      >
                        {order.shippingAddress?.city || "Customer"}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{ display: "block", textTransform: "uppercase" }}
                    >
                      Order # {order._id.slice(-8).toUpperCase()}
                    </span>
                    <span style={{ color: "#007185", fontSize: "0.78rem" }}>
                      ID: {order._id.slice(-12)}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: "20px" }}>
                  <div
                    style={{
                      fontWeight: "800",
                      fontSize: "1.1rem",
                      marginBottom: "15px",
                      color: "#111",
                    }}
                  >
                    {order.orderStatus === "delivered"
                      ? "Delivered 2-3 days ago"
                      : "Status: " + order.orderStatus.toUpperCase()}
                  </div>

                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        gap: "20px",
                        paddingBottom: "20px",
                        borderBottom:
                          idx < order.items.length - 1
                            ? "1px solid #eee"
                            : "none",
                        marginBottom:
                          idx < order.items.length - 1 ? "15px" : "0",
                      }}
                    >
                      <img
                        src={getProductImage(item)}
                        alt=""
                        style={{
                          width: "90px",
                          height: "90px",
                          objectFit: "contain",
                          background: "#fff",
                          border: "1px solid #eee",
                          borderRadius: "4px",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/150?text=No+Image";
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            color: "#007185",
                            fontWeight: "700",
                            fontSize: "1rem",
                            marginBottom: "5px",
                          }}
                        >
                          {item.product?.title || "Product no longer available"}
                        </div>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: "#565959",
                            marginBottom: "10px",
                          }}
                        >
                          Qty: {item.quantity} |{" "}
                          <Link
                            to={
                              item.product
                                ? `/product/${item.product._id}`
                                : "#"
                            }
                            style={{ color: "#007185", textDecoration: "none" }}
                          >
                            Buy it again
                          </Link>
                        </div>
                        <Link
                          to="#"
                          style={{
                            display: "inline-block",
                            background: "#FFD814",
                            border: "1px solid #FCD200",
                            padding: "6px 15px",
                            borderRadius: "100px",
                            textDecoration: "none",
                            color: "#111",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                          }}
                        >
                          Write a product review
                        </Link>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          minWidth: "150px",
                        }}
                      >
                        <button
                          onClick={() =>
                            showToast(
                              `📦 Order #${order._id.slice(-8).toUpperCase()} — Status: ${order.orderStatus.toUpperCase()}. Estimated delivery: 3-5 business days.`,
                              "info"
                            )
                          }
                          style={{
                            padding: "8px 25px",
                            background: "#FFD814",
                            border: "1px solid #FCD200",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                          }}
                        >
                          Track package
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "100px 0",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ color: "#565959" }}>No orders found.</h3>
              <Link to="/products" style={{ color: "#007185" }}>
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;
