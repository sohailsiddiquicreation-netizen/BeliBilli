import { useEffect, useState } from "react";
import { getBanners, createBanner, deleteBanner } from "../../api/banner";
import "./Admin.css";

function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "/products",
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await getBanners();
      setBanners(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createBanner(formData);
      setFormData({ title: "", subtitle: "", image: "", link: "/products" });
      fetchBanners();
    } catch (e) {
      alert("Error adding banner");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this banner?")) {
      await deleteBanner(id);
      fetchBanners();
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Carousel Manager</h1>
        <p>Dynamic promotion for the storefront.</p>
      </div>

      <div
        className="admin-card"
        style={{ padding: "30px", marginBottom: "30px" }}
      >
        <h3>Add New Promo Banner</h3>
        <form
          onSubmit={handleAdd}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <input
            placeholder="Banner Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="admin-input"
            required
          />
          <input
            placeholder="Short Subtitle"
            value={formData.subtitle}
            onChange={(e) =>
              setFormData({ ...formData, subtitle: e.target.value })
            }
            className="admin-input"
          />
          <input
            placeholder="Image URL (Direct link)"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            className="admin-input"
            required
          />
          <input
            placeholder="Link Path (/products)"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="admin-input"
          />
          <button
            type="submit"
            className="admin-btn primary"
            style={{ gridColumn: "1 / -1" }}
          >
            Publish Banner
          </button>
        </form>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Title</th>
              <th>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner._id}>
                <td>
                  <img
                    src={banner.image}
                    alt=""
                    style={{
                      width: "60px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                </td>
                <td>{banner.title}</td>
                <td>{banner.link}</td>
                <td>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="admin-btn secondary"
                    style={{ color: "red" }}
                  >
                    Remove
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

export default BannerManager;
