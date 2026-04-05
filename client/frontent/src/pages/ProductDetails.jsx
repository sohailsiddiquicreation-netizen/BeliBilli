import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCartCount, showToast } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Loading... — BeliBeli.com";
    setLoading(true);
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
        setSelectedImage(0);
        setQuantity(1);
        document.title = `${res.data.title} — BeliBeli.com`;

        // Fetch related products from same category
        const allRes = await API.get("/products");
        const allProds = allRes.data.products || [];
        const catName = res.data.category?.name;
        const relatedItems = allProds
          .filter(
            (p) =>
              p._id !== res.data._id &&
              (p.category?.name === catName || !catName),
          )
          .slice(0, 6);
        setRelated(relatedItems);
      } catch (error) {
        showToast("Failed to load product", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, showToast]);

  const addToCart = async (redirect = false) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login?redirect=cart");
      return;
    }
    try {
      await API.post("/cart", { productId: product._id, quantity });
      fetchCartCount();
      if (redirect) {
        navigate("/checkout"); // or /cart, but buy now usually goes directly to checkout or cart. Cart is safer if checkout needs cart state.
      } else {
        showToast(`${product.title} (×${quantity}) added to cart!`);
      }
    } catch {
      showToast("Could not add to cart", "error");
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "100px", color: "#555" }}>
        <div style={{ fontSize: "2rem", marginBottom: "15px" }}>⏳</div>
        <p>Loading product...</p>
      </div>
    );

  if (!product)
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        <h2>Product not found</h2>
        <Link to="/products" style={{ color: "#007185" }}>
          Back to products
        </Link>
      </div>
    );

  const images =
    product.images?.length > 0
      ? product.images
      : ["https://placehold.co/400?text=Product"];

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Breadcrumbs (#6) */}
      <div
        style={{
          padding: "10px 30px",
          fontSize: "0.82rem",
          color: "#565959",
          borderBottom: "1px solid #eee",
          background: "#fafafa",
        }}
      >
        <Link to="/" style={{ color: "#007185", textDecoration: "none" }}>
          Home
        </Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <Link
          to="/products"
          style={{ color: "#007185", textDecoration: "none" }}
        >
          Products
        </Link>
        <span style={{ margin: "0 8px" }}>›</span>
        {product.category?.name && (
          <>
            <Link
              to={`/products?search=${product.category.name}`}
              style={{ color: "#007185", textDecoration: "none" }}
            >
              {product.category.name}
            </Link>
            <span style={{ margin: "0 8px" }}>›</span>
          </>
        )}
        <span style={{ color: "#333" }}>{product.title}</span>
      </div>

      {/* Main Product Section */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          padding: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Image Gallery (#16 zoom) */}
        <div style={{ display: "flex", gap: "15px", flexShrink: 0 }}>
          {/* Thumbnails */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(idx)}
                style={{
                  width: "50px",
                  height: "50px",
                  border:
                    selectedImage === idx
                      ? "2px solid #FF9900"
                      : "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={img}
                  alt=""
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/50?text=...";
                  }}
                />
              </div>
            ))}
          </div>

          {/* Main Image with hover zoom */}
          <div
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            style={{
              width: "400px",
              height: "400px",
              border: "1px solid #eee",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              cursor: "zoom-in",
              position: "relative",
              background: "#fff",
            }}
          >
            <img
              src={images[selectedImage]}
              alt={product.title}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                transition: "transform 0.3s ease",
                transform: zoomed ? "scale(1.5)" : "scale(1)",
              }}
              onError={(e) => {
                e.target.src = "https://placehold.co/400?text=No+Image";
              }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "400",
              color: "#0F1111",
              margin: "0 0 8px 0",
              lineHeight: "1.4",
            }}
          >
            {product.title}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <span style={{ color: "#FF9900", fontSize: "1rem" }}>★★★★☆</span>
            <span style={{ color: "#007185", fontSize: "0.85rem" }}>
              4.2 (1,247 ratings)
            </span>
          </div>

          <div
            style={{
              borderTop: "1px solid #eee",
              borderBottom: "1px solid #eee",
              padding: "15px 0",
              margin: "10px 0",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "5px" }}
            >
              <span style={{ fontSize: "0.85rem", color: "#565959" }}>₹</span>
              <span
                style={{
                  fontSize: "2rem",
                  fontWeight: "400",
                  color: "#B12704",
                }}
              >
                {product.price?.toLocaleString("en-IN")}
              </span>
            </div>
            <div
              style={{
                color: "#565959",
                fontSize: "0.82rem",
                marginTop: "5px",
              }}
            >
              Inclusive of all taxes
            </div>
          </div>

          <div
            style={{
              margin: "15px 0",
              fontSize: "0.9rem",
              lineHeight: "1.7",
              color: "#333",
            }}
          >
            {product.description || "No description available."}
          </div>

          <div style={{ marginBottom: "15px", fontSize: "0.9rem" }}>
            <span style={{ fontWeight: "700" }}>FREE delivery</span>{" "}
            <span style={{ fontWeight: "700", color: "#0F1111" }}>
              Wed, 9 Apr
            </span>
          </div>

          {product.stock > 0 ? (
            <div
              style={{
                color: "#007600",
                fontWeight: "700",
                fontSize: "1.2rem",
                marginBottom: "15px",
              }}
            >
              In Stock
            </div>
          ) : (
            <div
              style={{
                color: "#B12704",
                fontWeight: "700",
                fontSize: "1.2rem",
                marginBottom: "15px",
              }}
            >
              Out of Stock
            </div>
          )}

          {/* Quantity Selector (#1) */}
          {product.stock > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "20px",
              }}
            >
              <label style={{ fontSize: "0.9rem", fontWeight: "600" }}>
                Qty:
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{
                  padding: "8px 15px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  background: "#F0F2F2",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 5px rgba(15,17,17,.15)",
                }}
              >
                {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxWidth: "300px",
            }}
          >
            <button
              onClick={() => addToCart(false)}
              disabled={product.stock === 0}
              style={{
                background: "#FFD814",
                border: "1px solid #FCD200",
                padding: "12px",
                borderRadius: "20px",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: product.stock > 0 ? "pointer" : "not-allowed",
                opacity: product.stock === 0 ? 0.5 : 1,
              }}
            >
              Add to Cart
            </button>
            <button
              onClick={() => addToCart(true)}
              disabled={product.stock === 0}
              style={{
                background: "#FA8900",
                border: "1px solid #E47911",
                padding: "12px",
                borderRadius: "20px",
                fontWeight: "700",
                fontSize: "0.95rem",
                color: "#fff",
                cursor: product.stock > 0 ? "pointer" : "not-allowed",
                opacity: product.stock === 0 ? 0.5 : 1,
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products (#3) */}
      {related.length > 0 && (
        <section
          style={{
            margin: "40px 30px",
            padding: "25px",
            background: "#fff",
            borderTop: "1px solid #eee",
            maxWidth: "1200px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h2
            style={{
              fontSize: "1.4rem",
              fontWeight: "800",
              marginBottom: "20px",
              color: "#0F1111",
            }}
          >
            Customers who bought this also bought
          </h2>
          <div
            style={{
              display: "flex",
              gap: "20px",
              overflowX: "auto",
              paddingBottom: "10px",
            }}
          >
            {related.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                style={{
                  textDecoration: "none",
                  color: "#0F1111",
                  minWidth: "170px",
                  maxWidth: "170px",
                }}
              >
                <div
                  style={{
                    height: "170px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f8f8f8",
                    borderRadius: "4px",
                    marginBottom: "8px",
                  }}
                >
                  <img
                    src={p.images?.[0] || "https://placehold.co/170"}
                    alt=""
                    style={{
                      maxWidth: "90%",
                      maxHeight: "90%",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/170?text=Product";
                    }}
                  />
                </div>
                <h4
                  style={{
                    fontSize: "0.82rem",
                    margin: "0 0 4px 0",
                    height: "34px",
                    overflow: "hidden",
                    fontWeight: "400",
                    color: "#007185",
                  }}
                >
                  {p.title}
                </h4>
                <div
                  style={{
                    color: "#B12704",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                  }}
                >
                  ₹{p.price?.toLocaleString("en-IN")}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetails;
