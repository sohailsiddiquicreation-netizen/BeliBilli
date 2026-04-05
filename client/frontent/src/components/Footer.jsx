import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      style={{
        background: "#232f3e",
        color: "#fff",
        paddingTop: "40px",
        marginTop: "auto",
        fontSize: "0.85rem",
      }}
    >
      <div
        style={{
          background: "#37475a",
          padding: "15px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <span onClick={() => window.scrollTo(0, 0)}>Back to top</span>
      </div>

      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px",
          padding: "40px 20px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <div>
          <h4 style={{ marginBottom: "15px" }}>Get to Know Us</h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              color: "#DDD",
            }}
          >
            <li>Careers</li>
            <li>Blog</li>
            <li>About BeliBeli</li>
            <li>Sustainability</li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: "15px" }}>Make Money with Us</h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              color: "#DDD",
            }}
          >
            <li>Sell products on BeliBeli</li>
            <li>Sell apps on BeliBeli</li>
            <li>Become an Affiliate</li>
            <li>Advertise Your Products</li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: "15px" }}>BeliBeli Payment Products</h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              color: "#DDD",
            }}
          >
            <li>BeliBeli Business Card</li>
            <li>Shop with Points</li>
            <li>Reload Your Balance</li>
            <li>BeliBeli Currency Converter</li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: "15px" }}>Let Us Help You</h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              color: "#DDD",
            }}
          >
            <li>Your Account</li>
            <li>Your Orders</li>
            <li>Shipping Rates & Policies</li>
            <li>Help</li>
          </ul>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #3a4553",
          padding: "30px 0",
          textAlign: "center",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontSize: "1.2rem",
            fontWeight: "800",
          }}
        >
          BeliBeli<span style={{ color: "#febd69" }}>.com</span>
        </Link>
        <p style={{ fontSize: "0.75rem", color: "#999", marginTop: "20px" }}>
          © 1996-2026, BeliBeli.com, Inc. or its affiliates
        </p>
      </div>
    </footer>
  );
}

export default Footer;
