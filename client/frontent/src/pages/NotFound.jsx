import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px",
        background: "#f3f3f3",
      }}
    >
      <div style={{ fontSize: "6rem", marginBottom: "10px" }}>🔍</div>
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "800",
          color: "#111",
          margin: "0 0 10px 0",
        }}
      >
        Sorry, we couldn't find that page
      </h1>
      <p
        style={{
          color: "#565959",
          fontSize: "1rem",
          maxWidth: "500px",
          marginBottom: "30px",
        }}
      >
        The page you're looking for has been moved, removed, or doesn't exist.
      </p>
      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Link
          to="/"
          style={{
            background: "#FFD814",
            border: "1px solid #FCD200",
            padding: "12px 30px",
            borderRadius: "8px",
            textDecoration: "none",
            color: "#111",
            fontWeight: "700",
            fontSize: "0.95rem",
          }}
        >
          Go to Homepage
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
          Browse Products
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
