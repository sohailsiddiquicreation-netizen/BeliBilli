import { Link, Outlet } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="logo-icon"></div>
          <h2>E-COM</h2>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/admin">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/products">All Products</Link>
            </li>
            <li>
              <Link to="/admin/products/add">Add Product</Link>
            </li>
            <li>
              <Link to="/admin/categories">All Categories</Link>
            </li>
            <li>
              <Link to="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link to="/admin/users">Users</Link>
            </li>
            <li>
              <Link to="/admin/banners">Carousel Manager</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
