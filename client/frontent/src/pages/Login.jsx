import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import API from "../api/axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { document.title = "Sign In — BeliBeli.com"; }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      // Cookie is set automatically by browser from server response
      const redirect = searchParams.get("redirect");
      navigate(redirect ? `/${redirect}` : "/");
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>

        {error && (
          <div
            style={{
              background: "#fff3cd",
              border: "1px solid #ffc107",
              padding: "10px 15px",
              borderRadius: "8px",
              color: "#856404",
              fontSize: "0.9rem",
              marginBottom: "10px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "15px",
            fontSize: "0.9rem",
            color: "#555",
          }}
        >
          New to BeliBeli?{" "}
          <Link to="/register" style={{ color: "#007185", fontWeight: "700" }}>
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
