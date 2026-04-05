import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      getProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>All Products</h1>
      </header>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Product</th>
              <th>Status</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <div
                    className="product-cell"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      className="product-img-mini"
                      style={{
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#f8f9fa",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        "📦"
                      )}
                    </div>
                    <span className="product-name">{product.title}</span>
                  </div>
                </td>
                <td>
                  <span className="badge badge-live">Live</span>
                </td>
                <td>{product.stock}</td>
                <td>₹{product.price.toLocaleString("en-IN")}</td>
                <td>
                  <Link
                    to={`/admin/products/edit/${product._id}`}
                    className="action-btn-del"
                  >
                    <button
                      style={{
                        background: "#4B68FF",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                  </Link>
                  <button
                    className="action-btn-del"
                    onClick={() => deleteProduct(product._id)}
                     style={{
    background: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginLeft: "6px"
  }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;
