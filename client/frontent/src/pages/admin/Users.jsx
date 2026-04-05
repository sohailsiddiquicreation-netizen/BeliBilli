import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useCart } from "../../context/CartContext";

function Users() {
  const { showToast } = useCart();
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const updateRole = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}`, { role });
      showToast(`User role updated to ${role}`, "success");
      getUsers();
    } catch (error) {
      showToast("Error updating user role", "error");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await API.delete(`/admin/users/${id}`);
        getUsers();
        showToast("User deleted successfully", "success");
      } catch (error) {
        showToast("Error deleting user", "error");
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>User Management</h1>
      </header>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email Address</th>
              <th>Current Role</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="product-name">{user.name}</div>
                </td>
                <td style={{ color: "#666" }}>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user._id, e.target.value)}
                    className={`badge ${user.role === "admin" ? "badge-live" : "badge-draft"}`}
                    style={{
                      border: "none",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={{ fontSize: "0.85rem" }}>
                  {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </td>
                <td>
                  <button
                    className="action-btn-del"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete Account
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

export default Users;
