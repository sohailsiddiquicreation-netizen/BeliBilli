import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useCart } from "../../context/CartContext";

function EditProduct() {
  const { showToast } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get(`/products/${id}`),
          API.get("/categories"),
        ]);
        setFormData({
          ...prodRes.data,
          category: prodRes.data.category?._id || prodRes.data.category,
        });
        setCategories(catRes.data);
      } catch (error) {
        showToast("Error fetching data", "error");
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRemoveImage = (imgUrl) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((img) => img !== imgUrl)
    }));
  };

  const handleRemoveNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const base64Images = [];
      for (const file of imageFiles) {
        const reader = new FileReader();
        const base64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
        base64Images.push(base64);
      }

      await API.put(`/products/${id}`, {
        ...formData,
        images: [...(formData.images || []), ...base64Images]
      });
      showToast("Product updated successfully", "success");
      navigate("/admin/products");
    } catch (error) {
      showToast("Error updating product", "error");
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Edit Product</h1>
      </header>

      <div className="admin-table-container" style={{ maxWidth: "600px" }}>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <label>Product Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
            }}
          >
            <div>
              <label>Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.parent ? `${cat.parent.name} > ` : ""}{cat.name}
              </option>
            ))}
          </select>

          <label>Current Images</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {(formData.images || []).map((img, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <img src={img} alt={`Product ${idx}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img)}
                  style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <label>Upload New Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImageFiles((prev) => [...prev, ...Array.from(e.target.files)])}
          />

          {imageFiles.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
              {imageFiles.map((file, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={URL.createObjectURL(file)} alt={`New ${idx}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #4B68FF' }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(idx)}
                    style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#4B68FF",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Update Product Details
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
