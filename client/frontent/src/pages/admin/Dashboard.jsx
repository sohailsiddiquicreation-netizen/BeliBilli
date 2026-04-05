import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "./Admin.css";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await API.get("/admin/dashboard");
        setStats(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    getStats();
  }, []);

  if (!stats)
    return (
      <div className="admin-content">
        <h2>Loading...</h2>
      </div>
    );

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Overview</h1>
          <p className="subtitle">Real-time Business Insights</p>
        </div>
        <div
          className="date-picker-mock"
          style={{
            background: "white",
            padding: "10px 20px",
            borderRadius: "12px",
            fontSize: "0.9rem",
            color: "#666",
            border: "1px solid #eee",
          }}
        >
          <span>
            📅{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </header>

      <section className="admin-stats-grid">
        <div className="stats-card">
          <div className="stats-icon bg-red">🛒</div>
          <div className="stats-info">
            <span className="label">Total Products</span>
            <span className="value">{stats.products}</span>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-icon bg-purple">📄</div>
          <div className="stats-info">
            <span className="label">Total Orders</span>
            <span className="value">{stats.orders}</span>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-icon bg-orange">👥</div>
          <div className="stats-info">
            <span className="label">Total Users</span>
            <span className="value">{stats.users}</span>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-icon bg-blue">💰</div>
          <div className="stats-info">
            <span className="label">Total Revenue</span>
            <span className="value">
              ₹{(stats.revenue || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </section>

      <div className="main-dashboard-grid">
        <div className="card-container">
          <div className="section-header">
            <h3>Revenue Growth</h3>
            <div className="chart-legend" style={{ fontSize: "0.85rem" }}>
              <span style={{ color: "#2DA44E" }}>● Revenue</span>
              <span style={{ color: "#4B68FF", marginLeft: "10px" }}>
                ● Orders
              </span>
            </div>
          </div>
          <div className="chart-body">
            <svg viewBox="0 0 800 250" className="chart-svg">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4B68FF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4B68FF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,200 Q200,100 400,150 T800,50"
                fill="transparent"
                stroke="#4B68FF"
                strokeWidth="4"
              />
              <path
                d="M0,200 Q200,100 400,150 T800,50 V250 H0 Z"
                fill="url(#chartGradient)"
              />
              <circle cx="400" cy="150" r="6" fill="#4B68FF" />
              <text
                x="410"
                y="140"
                fill="#4B68FF"
                fontSize="12"
                fontWeight="700"
              >
                Live Revenue: ₹{stats.revenue?.toLocaleString("en-IN")}
              </text>
            </svg>
          </div>
        </div>

        <div className="card-container">
          <div className="section-header">
            <h3>Recent Orders</h3>
          </div>
          <div className="recent-orders-list">
            {(stats.recentOrders || []).map((order) => (
              <div className="order-item-mini" key={order._id}>
                <div
                  className="stats-icon bg-blue"
                  style={{ width: "40px", height: "40px", fontSize: "1rem" }}
                >
                  📦
                </div>
                <div className="mini-info">
                  <h4>{order.user?.name || "Anonymous"}</h4>
                  <span
                    className="cat"
                    style={{
                      color:
                        order.orderStatus === "processing"
                          ? "#ff9e4b"
                          : "#2da44e",
                    }}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div className="mini-price">
                  <span className="price">₹{order.totalPrice?.toLocaleString("en-IN")}</span>
                  <span className="qty">{order.items?.length || 0} items</span>
                </div>
              </div>
            ))}
            {!stats.recentOrders?.length && (
              <p style={{ color: "#8c8f9f", fontSize: "0.9rem" }}>
                No orders found.
              </p>
            )}
          </div>
          <Link
            to="/admin/orders"
            style={{
              display: "block",
              width: "100%",
              marginTop: "20px",
              padding: "12px",
              background: "#f0f2ff",
              color: "#4B68FF",
              borderRadius: "12px",
              textAlign: "center",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            View All Transaction
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
