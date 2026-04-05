import { useState, useEffect } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./AddProduct.css";

function AddProduct() {
  const { showToast } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: "",
  });
  const [imageFiles, setImageFiles] = useState([]);

  const handleRemoveNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const res = await API.get("/categories");
      setCategories(res.data);
    };
    getCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
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

      const currentImages = formData.images ? formData.images.split(",").map(i => i.trim()).filter(Boolean) : [];

      await API.post("/products", {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: [...currentImages, ...base64Images], // mix URLs and base64
      });

      showToast("Product added successfully");
      navigate("/admin/products");
    } catch (error) {
      showToast(
        "Error adding product: " +
          (error.response?.data?.message || "Server Error"),
        "error"
      );
    }
  };

  return (
    <div className="add-product">
      <div className="form-card">
        <h2>Add New Product</h2>

        <form onSubmit={handleAddProduct}>

          <div className="form-group">
            <label>Product Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="form-group">
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
          </div>

          <div className="form-group">
            <label>Image URLs (fallback)</label>
            <input
              type="text"
              name="images"
              placeholder="comma separated image URLs"
              value={formData.images}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Upload Images directly</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImageFiles((prev) => [...prev, ...Array.from(e.target.files)])}
            />
          </div>

          {imageFiles.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
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

          <button className="submit-btn">
            Add Product
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddProduct;