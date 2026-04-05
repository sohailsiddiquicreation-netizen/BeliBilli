import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useCart } from "../../context/CartContext";
import "./AdminCategories.css";

function AdminCategories() {
  const { showToast } = useCart();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parent, setParent] = useState("");

  const getCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const createCategory = async (e) => {
    e.preventDefault();

    try {
      await API.post("/categories", { name, description, parent: parent || undefined });
      showToast("Category created successfully", "success");
      setName("");
      setDescription("");
      setParent("");
      getCategories();
    } catch (error) {
      showToast("Error creating category", "error");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await API.delete(`/categories/${id}`);
      showToast("Category deleted successfully", "success");
      getCategories();
    } catch (error) {
      console.error("Delete error:", error);
      showToast(error.response?.data?.message || "Cannot delete category", "error");
    }
  };

  return (
    <div className="admin-categories">
      <h2 className="title">Manage Categories</h2>

      {/* Form */}
      <form className="category-form" onSubmit={createCategory}>
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={parent}
          onChange={(e) => setParent(e.target.value)}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        >
          <option value="">No Parent (Root Category)</option>
          {categories.filter(c => !c.parent).map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button type="submit">Add Category</button>
      </form>

      {/* Categories List */}
      <div className="category-list">
        {categories.map((cat) => (
          <div className="category-card" key={cat._id}>
            <div>
              <h4>{cat.name} {cat.parent && <span style={{fontSize: "0.8rem", color: "#666", fontWeight: "normal"}}>(Subcategory of {cat.parent.name})</span>}</h4>
              <p>{cat.description}</p>
            </div>

            <button
              className="delete-btn"
              onClick={() => deleteCategory(cat._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCategories;