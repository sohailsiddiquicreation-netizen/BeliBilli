import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/axios";
import { useCart } from "../context/CartContext";
import "../Landing.css";

function StarRating({ rating = 4.5, count = 0 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{
          color:
            i <= Math.floor(rating)
              ? "#FF9900"
              : i - 0.5 <= rating
                ? "#FF9900"
                : "#ccc",
          fontSize: "0.95rem",
        }}
      >
        ★
      </span>,
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {stars}
      <span
        style={{ color: "#007185", fontSize: "0.85rem", marginLeft: "4px" }}
      >
        {count.toLocaleString()}
      </span>
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [freeShipping, setFreeShipping] = useState(false);
  const [priceFilter, setPriceFilter] = useState(10000);
  const [sortBy, setSortBy] = useState("featured");
  const [textSearch, setTextSearch] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast, fetchCartCount } = useCart();

  // Sync URL search param into the text search box
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setTextSearch(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    document.title = "All Products — BeliBeli.com";
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get("/products"),
          API.get("/categories"),
        ]);
        const prods = prodRes.data.products;
        setProducts(prods);
        setCategories(catRes.data);
        const highest = Math.max(...prods.map((p) => p.price), 1000);
        setMaxPrice(highest);
        setPriceFilter(highest);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login?redirect=cart");
      return;
    }
    try {
      await API.post("/cart", { productId: product._id, quantity: 1 });
      fetchCartCount();
      showToast(`"${product.title}" added to cart! 🛒`);
    } catch (err) {
      showToast("Could not add to cart", "error");
    }
  };

  let filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) =>
            p.category?.name === selectedCategory ||
            p.category === selectedCategory,
        );

  // Apply text search
  if (textSearch.trim()) {
    const q = textSearch.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q),
    );
  }

  filteredProducts = filteredProducts.filter((p) => p.price <= priceFilter);
  if (freeShipping)
    filteredProducts = filteredProducts.filter((p) => p.price > 49);

  if (sortBy === "price_asc")
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  else if (sortBy === "price_desc")
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  else if (sortBy === "newest")
    filteredProducts = [...filteredProducts].reverse();

  // Stable ratings per product (useMemo ensures they don't change on re-render)
  const productRatings = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const seed = (p._id || "")
        .split("")
        .reduce((acc, c) => acc + c.charCodeAt(0), 0);
      map[p._id] = {
        rating: (3.5 + (seed % 15) / 10).toFixed(1),
        reviews: 50 + (seed % 900),
      };
    });
    return map;
  }, [products]);

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Results Header */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #ddd",
          padding: "8px 20px",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#565959" }}>
          1–{filteredProducts.length} of{" "}
          <strong style={{ color: "#C7511F" }}>
            over {filteredProducts.length} results
          </strong>
        </p>
      </div>

      <div style={{ display: "flex", maxWidth: "1480px", margin: "0 auto" }}>
        {/* LEFT SIDEBAR */}
        <aside
          style={{
            width: "220px",
            minWidth: "220px",
            padding: "20px 15px",
            borderRight: "1px solid #ddd",
            fontSize: "0.85rem",
          }}
        >
          {/* Category Filter */}
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                fontWeight: "700",
                borderBottom: "1px solid #ddd",
                paddingBottom: "8px",
                marginBottom: "10px",
              }}
            >
              Category
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {["All", ...categories.map((c) => c.name)].map((cat) => (
                <li key={cat} style={{ marginBottom: "6px" }}>
                  <span
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      cursor: "pointer",
                      color: selectedCategory === cat ? "#C7511F" : "#007185",
                      fontWeight: selectedCategory === cat ? "700" : "400",
                    }}
                  >
                    {cat}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Text Search */}
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                fontWeight: "700",
                borderBottom: "1px solid #ddd",
                paddingBottom: "8px",
                marginBottom: "10px",
              }}
            >
              Search
            </h4>
            <input
              type="text"
              placeholder="Search products..."
              value={textSearch}
              onChange={(e) => {
                setTextSearch(e.target.value);
                navigate(
                  e.target.value
                    ? `/products?search=${encodeURIComponent(e.target.value)}`
                    : "/products",
                  { replace: true },
                );
              }}
              style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "0.85rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Delivery Day */}
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                fontWeight: "700",
                borderBottom: "1px solid #ddd",
                paddingBottom: "8px",
                marginBottom: "10px",
              }}
            >
              Delivery Day
            </h4>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input type="checkbox" style={{ accentColor: "#C7511F" }} />
              Get it in 2 Days
            </label>
          </div>

          {/* Free Shipping */}
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                fontWeight: "700",
                borderBottom: "1px solid #ddd",
                paddingBottom: "8px",
                marginBottom: "10px",
              }}
            >
              Eligible for Free Shipping
            </h4>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={freeShipping}
                onChange={(e) => setFreeShipping(e.target.checked)}
                style={{ accentColor: "#C7511F" }}
              />
              Free Shipping
            </label>
            <p
              style={{
                color: "#565959",
                fontSize: "0.78rem",
                margin: "5px 0 0 0",
              }}
            >
              Get FREE Shipping on eligible orders shipped by BeliBeli
            </p>
          </div>

          {/* Price Filter */}
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                fontWeight: "700",
                borderBottom: "1px solid #ddd",
                paddingBottom: "8px",
                marginBottom: "10px",
              }}
            >
              Price
            </h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                fontSize: "0.8rem",
                color: "#565959",
              }}
            >
              <span>₹0</span>
              <span>₹{priceFilter.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={0}
              max={maxPrice}
              value={priceFilter}
              onChange={(e) => setPriceFilter(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#007185" }}
            />
            <div style={{ marginTop: "10px" }}>
              {[250, 500, 1000].map((p) => (
                <div key={p} style={{ marginBottom: "4px" }}>
                  <span
                    onClick={() => setPriceFilter(p)}
                    style={{ cursor: "pointer", color: "#007185" }}
                  >
                    Up to ₹{p.toLocaleString()}
                  </span>
                </div>
              ))}
              <span
                onClick={() => setPriceFilter(maxPrice)}
                style={{ cursor: "pointer", color: "#007185" }}
              >
                Over ₹1,000
              </span>
            </div>
          </div>

          {/* Deals */}
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                fontWeight: "700",
                borderBottom: "1px solid #ddd",
                paddingBottom: "8px",
                marginBottom: "10px",
              }}
            >
              Deals &amp; Discounts
            </h4>
            <div
              style={{
                color: "#007185",
                cursor: "pointer",
                marginBottom: "4px",
              }}
            >
              All Discounts
            </div>
            <div style={{ color: "#007185", cursor: "pointer" }}>
              Today's Deals
            </div>
          </div>

          {/* Brands */}
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                fontWeight: "700",
                borderBottom: "1px solid #ddd",
                paddingBottom: "8px",
                marginBottom: "10px",
              }}
            >
              Brands
            </h4>
            {["Apple", "Samsung", "Sony", "HP", "Dell"].map((brand) => (
              <label
                key={brand}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                  cursor: "pointer",
                }}
              >
                <input type="checkbox" style={{ accentColor: "#C7511F" }} />
                {brand}
              </label>
            ))}
          </div>
        </aside>

        {/* MAIN RESULTS AREA */}
        <main style={{ flex: 1, padding: "15px 20px" }}>
          {/* Sort Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "15px",
              background: "linear-gradient(to right, #f3f3f3, #e7e7e7)",
              padding: "8px 15px",
              borderRadius: "4px",
            }}
          >
            <span style={{ fontSize: "0.9rem", color: "#111" }}>
              <strong>Results</strong>&nbsp;
              <span style={{ color: "#007185", fontSize: "0.82rem" }}>
                Check each product page for other buying options.
              </span>
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ color: "#111" }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "5px 10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  background: "#fff",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Product List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <h3 style={{ color: "#565959" }}>No products found.</h3>
                <p style={{ color: "#888" }}>Try adjusting your filters.</p>
              </div>
            ) : (
              filteredProducts.map((product, idx) => {
                const { rating, reviews } = productRatings[product._id] || {
                  rating: 4.5,
                  reviews: 100,
                };
                const isSponsor = idx < 2;
                const deliveryDay = idx % 2 === 0 ? "Sat, 5 Apr" : "Tue, 8 Apr";
                return (
                  <div
                    key={product._id}
                    style={{
                      display: "flex",
                      gap: "20px",
                      padding: "20px 0",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {/* Product Image */}
                    <Link
                      to={`/product/${product._id}`}
                      style={{ textDecoration: "none", flexShrink: 0 }}
                    >
                      <div
                        style={{
                          width: "180px",
                          height: "180px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#fff",
                          border: "1px solid #eee",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={
                            product.images?.[0] ||
                            `https://placehold.co/180?text=${encodeURIComponent(product.title?.slice(0, 8))}`
                          }
                          alt={product.title}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            e.target.src = `https://placehold.co/180?text=Product`;
                          }}
                        />
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div style={{ flex: 1 }}>
                      {isSponsor && (
                        <div
                          style={{
                            fontSize: "0.72rem",
                            color: "#565959",
                            marginBottom: "4px",
                          }}
                        >
                          Sponsored ⓘ
                        </div>
                      )}
                      <Link
                        to={`/product/${product._id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <h2
                          style={{
                            fontSize: "1rem",
                            fontWeight: "500",
                            color: "#0F1111",
                            margin: "0 0 6px 0",
                            lineHeight: "1.4",
                          }}
                        >
                          {product.title}
                          {product.category?.name && (
                            <span
                              style={{ fontWeight: "400", color: "#565959" }}
                            >
                              {" "}
                              – {product.category.name}
                            </span>
                          )}
                        </h2>
                      </Link>

                      <StarRating rating={rating} count={reviews} />

                      <div
                        style={{
                          margin: "8px 0",
                          fontSize: "0.85rem",
                          color: "#007185",
                          fontWeight: "600",
                        }}
                      >
                        500+ bought in past month
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: "6px",
                          margin: "6px 0",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "1.6rem",
                            fontWeight: "400",
                            color: "#0F1111",
                          }}
                        >
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: "0.82rem",
                          color: "#007185",
                          marginBottom: "4px",
                        }}
                      >
                        Save extra with{" "}
                        <span style={{ fontWeight: "700" }}>No Cost EMI</span>
                      </div>

                      <div
                        style={{
                          fontSize: "0.82rem",
                          color: "#0F1111",
                          marginBottom: "10px",
                        }}
                      >
                        <span style={{ fontWeight: "700" }}>FREE delivery</span>{" "}
                        {deliveryDay}
                      </div>

                      {product.stock === 0 ? (
                        <div
                          style={{
                            display: "inline-block",
                            background: "#cc0c39",
                            color: "#fff",
                            fontSize: "0.8rem",
                            fontWeight: "700",
                            padding: "4px 12px",
                            borderRadius: "4px",
                            marginBottom: "10px",
                          }}
                        >
                          Out of Stock
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          style={{
                            display: "inline-block",
                            background: "#FFD814",
                            color: "#0F1111",
                            border: "1px solid #FCD200",
                            borderRadius: "20px",
                            padding: "8px 20px",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            cursor: "pointer",
                            boxShadow: "0 2px 5px rgba(15,17,17,.15)",
                            transition: "background 0.15s",
                          }}
                          onMouseOver={(e) =>
                            (e.target.style.background = "#F7CA00")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.background = "#FFD814")
                          }
                        >
                          Add to cart
                        </button>
                      )}

                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "0.82rem",
                          color: "#007185",
                        }}
                      >
                        +{(idx % 4) + 1} other colors/patterns
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Products;
