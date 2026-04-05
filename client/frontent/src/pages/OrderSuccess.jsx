import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id") || "N/A";

  useEffect(() => {
    document.title = "Order Confirmed — BeliBeli.com";
  }, []);

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f3f3",
        padding: "40px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "60px 50px",
          textAlign: "center",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 4px 20px rgba(0,0,0,.08)",
          border: "1px solid #ddd",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "#dff0d8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 25px",
            fontSize: "2.5rem",
          }}
        >
          ✅
        </div>

        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: "800",
            color: "#0F1111",
            margin: "0 0 8px 0",
          }}
        >
          Order Confirmed!
        </h1>
        <p style={{ color: "#565959", fontSize: "1rem", margin: "0 0 25px 0" }}>
          Thank you for shopping with BeliBeli. Your order has been placed
          successfully.
        </p>

        <div
          style={{
            background: "#F0F2F2",
            borderRadius: "8px",
            padding: "15px 20px",
            margin: "0 0 30px 0",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span style={{ color: "#565959", fontSize: "0.85rem" }}>
              Order ID
            </span>
            <span
              style={{
                fontWeight: "700",
                color: "#0F1111",
                fontSize: "0.85rem",
              }}
            >
              #{orderId.slice(-10).toUpperCase()}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#565959", fontSize: "0.85rem" }}>
              Estimated Delivery
            </span>
            <span
              style={{
                fontWeight: "700",
                color: "#2DA44E",
                fontSize: "0.85rem",
              }}
            >
              3–5 Business Days
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/orders"
            style={{
              background: "#FFD814",
              border: "1px solid #FCD200",
              padding: "12px 30px",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#0F1111",
              fontWeight: "700",
              fontSize: "0.95rem",
            }}
          >
            View My Orders
          </Link>
          <Link
            to="/products"
            style={{
              background: "#fff",
              border: "1px solid #D5D9D9",
              padding: "12px 30px",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#007185",
              fontWeight: "700",
              fontSize: "0.95rem",
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
