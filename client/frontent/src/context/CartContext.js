import { createContext, useContext, useState, useCallback } from "react";
import API from "../api/axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState(null);

  const fetchCartCount = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setCartCount(0);
      return;
    }
    try {
      const res = await API.get("/cart");
      const count =
        res.data?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  return (
    <CartContext.Provider
      value={{ cartCount, setCartCount, fetchCartCount, toast, showToast }}
    >
      {children}
      {/* Toast Notification UI */}
      {toast && (
        <div
          key={toast.id}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            background:
              toast.type === "success"
                ? "#0F1111"
                : toast.type === "error"
                  ? "#cc0c39"
                  : "#131921",
            color: "#fff",
            padding: "16px 28px",
            borderRadius: "8px",
            boxShadow: "0 8px 30px rgba(0,0,0,.25)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "0.95rem",
            fontWeight: "600",
            animation: "slideInToast 0.3s ease-out",
            maxWidth: "400px",
          }}
        >
          <span style={{ fontSize: "1.3rem" }}>
            {toast.type === "success"
              ? "✅"
              : toast.type === "error"
                ? "❌"
                : "ℹ️"}
          </span>
          {toast.message}
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
