import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { getBanners } from "../api/banner";
import "../Landing.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, banRes] = await Promise.all([
          API.get("/products"),
          getBanners(),
        ]);
        setProducts(prodRes.data.products);
        setBanners(banRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners]);

  useEffect(() => {
    document.title = "BeliBeli.com — India's Favourite Online Store";
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goSlide = (dir) => {
    setCurrentSlide((prev) => {
      if (dir === "next") return (prev + 1) % banners.length;
      return (prev - 1 + banners.length) % banners.length;
    });
  };

  return (
    <div
      className="container"
      style={{
        padding: "20px 0",
        background: "#f3f3f3",
        minHeight: "100vh",
        maxWidth: "100%",
      }}
    >
      <div style={{ maxWidth: "1480px", margin: "0 auto" }}>
        {/* Amazon Hero Carousel */}
        <section
          style={{
            position: "relative",
            height: "400px",
            marginBottom: "20px",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          {banners.length > 0 ? (
            banners.map((banner, index) => (
              <div
                key={banner._id}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  opacity: currentSlide === index ? 1 : 0,
                  transition: "opacity 1s ease-in-out",
                  backgroundImage: `linear-gradient(to bottom, transparent 60%, #f3f3f3 100%), url(${banner.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  padding: "60px",
                }}
              >
                <div style={{ maxWidth: "500px" }}>
                  <h1
                    style={{
                      fontSize: "3rem",
                      fontWeight: "800",
                      color: "#111",
                      margin: "0 0 20px 0",
                    }}
                  >
                    {banner.title}
                  </h1>
                  <Link to={banner.link} className="hero-btn">
                    Shop the collection
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                height: "100%",
                background:
                  "linear-gradient(to bottom, #d9e4f5 0%, #f3f3f3 100%)",
                display: "flex",
                alignItems: "center",
                padding: "60px",
              }}
            >
              <div style={{ maxWidth: "600px" }}>
                <h1
                  style={{ fontSize: "3rem", fontWeight: "800", color: "#111" }}
                >
                  Upgrade your lifestyle.
                </h1>
                <h3 style={{ color: "#CC0C39" }}>
                  Up to 40% off top fashion brands.
                </h3>
                <Link
                  to="/products"
                  className="hero-btn"
                  style={{ marginTop: "20px" }}
                >
                  See all deals
                </Link>
              </div>
            </div>
          )}

          {/* Carousel Arrows */}
          {banners.length > 1 && (
            <>
              <button
                className="carousel-arrow left"
                onClick={() => goSlide("prev")}
              >
                ❮
              </button>
              <button
                className="carousel-arrow right"
                onClick={() => goSlide("next")}
              >
                ❯
              </button>
            </>
          )}
        </section>

        {/* Carousel Dots */}
        {banners.length > 1 && (
          <div className="carousel-dots">
            {banners.map((_, idx) => (
              <button
                key={idx}
                className={`carousel-dot ${currentSlide === idx ? "active" : ""}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
        )}

        {/* Home Grids */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
            marginTop: "-120px",
            padding: "0 20px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Card 1 */}
          <div
            style={{
              background: "#fff",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              borderRadius: "4px",
            }}
          >
            <h3
              style={{
                fontSize: "1.3rem",
                fontWeight: "800",
                marginBottom: "15px",
              }}
            >
              Best Deals %
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                flex: 1,
              }}
            >
              {products.slice(0, 4).map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p._id}`}
                  style={{ textDecoration: "none", color: "#111" }}
                >
                  <img
                    src={p.images?.[0] || "https://placehold.co/150"}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "contain",
                    }}
                    alt=""
                  />
                  <span
                    style={{
                      fontSize: "0.75rem",
                      display: "block",
                      marginTop: "5px",
                    }}
                  >
                    {p.title.slice(0, 20)}...
                  </span>
                </Link>
              ))}
            </div>
            <Link
              to="/products"
              style={{
                marginTop: "20px",
                color: "#007185",
                fontSize: "0.85rem",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              See more
            </Link>
          </div>

          {/* Card 2 */}
          <div
            style={{
              background: "#fff",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              borderRadius: "4px",
            }}
          >
            <h3
              style={{
                fontSize: "1.3rem",
                fontWeight: "800",
                marginBottom: "15px",
              }}
            >
              Top Picks for You
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                flex: 1,
              }}
            >
              {products.slice(4, 8).map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p._id}`}
                  style={{ textDecoration: "none", color: "#111" }}
                >
                  <img
                    src={p.images?.[0] || "https://placehold.co/150"}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "contain",
                    }}
                    alt=""
                  />
                  <span
                    style={{
                      fontSize: "0.75rem",
                      display: "block",
                      marginTop: "5px",
                    }}
                  >
                    {p.title.slice(0, 20)}...
                  </span>
                </Link>
              ))}
            </div>
            <Link
              to="/products"
              style={{
                marginTop: "20px",
                color: "#007185",
                fontSize: "0.85rem",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Explore all
            </Link>
          </div>

          {/* Single Feature Card */}
          <div
            style={{ background: "#fff", padding: "20px", borderRadius: "4px" }}
          >
            <h3
              style={{
                fontSize: "1.3rem",
                fontWeight: "800",
                marginBottom: "15px",
              }}
            >
              Limited Time Offer
            </h3>
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"
              style={{
                width: "100%",
                height: "260px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
              alt=""
            />
            <Link
              to="/products"
              style={{
                display: "block",
                marginTop: "15px",
                color: "#007185",
                fontSize: "0.85rem",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Shop the watch collection
            </Link>
          </div>
        </div>

        {/* Regular Scroll Row */}
        <section
          style={{
            margin: "40px 20px",
            background: "#fff",
            padding: "20px",
            borderRadius: "4px",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "800",
              marginBottom: "20px",
            }}
          >
            Recommended products
          </h2>
          <div
            style={{
              display: "flex",
              gap: "20px",
              overflowX: "auto",
              paddingBottom: "20px",
            }}
            className="hide-scroll"
          >
            {products.map((product) => (
              <div
                key={product._id}
                style={{ minWidth: "200px", maxWidth: "200px" }}
              >
                <Link
                  to={`/product/${product._id}`}
                  style={{ textDecoration: "none", color: "#111" }}
                >
                  <div
                    style={{
                      height: "200px",
                      background: "#f8f8f8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "10px",
                      borderRadius: "4px",
                    }}
                  >
                    <img
                      src={product.images?.[0] || "https://placehold.co/200"}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                      alt=""
                      onError={(e) => {
                        e.target.src = "https://placehold.co/200?text=No+Image";
                      }}
                    />
                  </div>
                  <h4
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      margin: "0 0 5px 0",
                      height: "40px",
                      overflow: "hidden",
                    }}
                  >
                    {product.title}
                  </h4>
                  <div
                    style={{
                      color: "#FF9900",
                      fontSize: "0.8rem",
                      marginBottom: "5px",
                    }}
                  >
                    ★★★★★ <span style={{ color: "#007185" }}>824</span>
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "800" }}>
                    ₹{product.price.toLocaleString("en-IN")}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
        {/* New Laptops Section */}
        <section
          style={{
            margin: "40px 20px",
            background: "#232f3e",
            padding: "30px",
            borderRadius: "4px",
            color: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", margin: 0 }}>
              High-Performance Computing
            </h2>
            <Link
              to="/products"
              style={{
                color: "#febd69",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              See all laptops
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              overflowX: "auto",
              paddingBottom: "10px",
            }}
            className="hide-scroll"
          >
            {products
              .slice()
              .reverse()
              .map((product) => (
                <div
                  key={product._id}
                  style={{
                    minWidth: "220px",
                    maxWidth: "220px",
                    background: "#fff",
                    borderRadius: "4px",
                    padding: "15px",
                  }}
                >
                  <Link
                    to={`/product/${product._id}`}
                    style={{ textDecoration: "none", color: "#111" }}
                  >
                    <div
                      style={{
                        height: "160px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <img
                        src={product.images?.[0] || "https://placehold.co/200"}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                        alt=""
                      />
                    </div>
                    <h4
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        margin: "0 0 5px 0",
                        height: "36px",
                        overflow: "hidden",
                      }}
                    >
                      {product.title}
                    </h4>
                    <div
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "800",
                        color: "#B12704",
                      }}
                    >
                      ₹{product.price.toLocaleString("en-IN")}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#565959",
                        marginTop: "5px",
                      }}
                    >
                      Ships to India
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </section>
      </div>

      {/* Back to Top Button */}
      <button
        className={`back-to-top${showBackToTop ? " visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        title="Back to top"
      >
        ↑
      </button>
    </div>
  );
}

export default Home;
