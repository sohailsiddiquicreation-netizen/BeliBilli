import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { cartCount, fetchCartCount } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (user) fetchCartCount();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  return (
    <nav
      style={{
        background: "#fff",
        padding: "15px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          fontSize: "1.6rem",
          fontWeight: "800",
          textDecoration: "none",
          color: "#1754a4",
        }}
      >
        Beli<span style={{ color: "#ff6b6b" }}>Bili</span>
      </Link>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          background: "#f5f7fb",
          borderRadius: "50px",
          padding: "6px",
          width: "40%",
        }}
      >
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            padding: "10px",
            outline: "none",
          }}
        />

        <button
          style={{
            background: "#1754a4",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "50px",
            cursor: "pointer",
          }}
        >
          🔍
        </button>
      </form>

      {/* Right Side */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "25px",
          fontWeight: "500",
        }}
      >
        <Link to="/products" style={{ textDecoration: "none", color: "#333" }}>
          Products
        </Link>

        <Link to="/orders" style={{ textDecoration: "none", color: "#333" }}>
          Orders
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          style={{
            textDecoration: "none",
            color: "#333",
            position: "relative",
          }}
        >
          🛒
          <span
            style={{
              position: "absolute",
              top: "-8px",
              right: "-12px",
              background: "#ff6b6b",
              color: "#fff",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
            }}
          >
            {cartCount}
          </span>
        </Link>

        {/* Profile */}
        {user ? (
          <div style={{ position: "relative" }}>
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              style={{
                background: "#1754a4",
                color: "#fff",
                padding: "8px 18px",
                borderRadius: "50px",
                cursor: "pointer",
              }}
            >
              {user.name?.split(" ")[0]}
            </div>

            {profileOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "45px",
                  right: 0,
                  background: "#fff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  padding: "10px",
                  minWidth: "170px",
                }}
              >
                <Link
                  to="/profile"
                  style={{
                    display: "block",
                    padding: "10px",
                    textDecoration: "none",
                    color: "#333",
                  }}
                >
                  👤 Profile
                </Link>

                <Link
                  to="/orders"
                  style={{
                    display: "block",
                    padding: "10px",
                    textDecoration: "none",
                    color: "#333",
                  }}
                >
                  📦 Orders
                </Link>

                {/* Admin Option */}
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    style={{
                      display: "block",
                      padding: "10px",
                      textDecoration: "none",
                      color: "#1754a4",
                      fontWeight: "600",
                    }}
                  >
                    ⚡ Admin Panel
                  </Link>
                )}

                <div
                  onClick={() => {
                    localStorage.removeItem("user");
                    window.location.reload();
                  }}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    color: "#ff4d4f",
                  }}
                >
                  🚪 Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            style={{
              background: "#1754a4",
              color: "#fff",
              padding: "8px 18px",
              borderRadius: "50px",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;