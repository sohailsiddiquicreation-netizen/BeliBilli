import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { document.title = "Create Account — BeliBeli.com"; }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {error && (
          <div
            style={{
              background: "#f8d7da",
              border: "1px solid #f5c6cb",
              padding: "10px 15px",
              borderRadius: "8px",
              color: "#721c24",
              fontSize: "0.9rem",
              marginBottom: "10px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          minLength={6}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "15px",
            fontSize: "0.9rem",
            color: "#555",
          }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#007185", fontWeight: "700" }}>
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
