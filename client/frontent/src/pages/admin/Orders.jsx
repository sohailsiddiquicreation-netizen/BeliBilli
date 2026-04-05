import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useCart } from "../../context/CartContext";

function AdminOrders() {
  const { showToast } = useCart();
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { orderStatus: status });
      getOrders();
      showToast("Status updated successfully", "success");
    } catch (error) {
      showToast("Error updating status", "error");
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case "delivered":
        return "badge-completed";
      case "processing":
        return "badge-processing";
      case "rejected":
        return "badge-rejected";
      case "shipped":
        return "badge-intransit";
      default:
        return "badge-onhold";
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Order Lists</h1>
      </header>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>ADDRESS</th>
              <th>DATE</th>
              <th>PRICE</th>
              <th style={{ textAlign: "center" }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td style={{ fontSize: "0.85rem", fontWeight: "500" }}>
                  {order._id.slice(-5)}
                </td>
                <td>
                  <span className="product-name">
                    {order.items[0]?.product?.title || "Product Removed"}
                    {order.items.length > 1 &&
                      ` + ${order.items.length - 1} more`}
                  </span>
                </td>
                <td>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#6a6e83",
                      maxWidth: "200px",
                    }}
                  >
                    {order.shippingAddress?.address},{" "}
                    {order.shippingAddress?.city}
                  </div>
                </td>
                <td style={{ fontSize: "0.85rem" }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td style={{ fontWeight: "700" }}>
                  ₹{order.totalPrice.toLocaleString("en-IN")}
                </td>
                <td style={{ textAlign: "center" }}>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className={`status-select ${getBadgeClass(order.orderStatus)}`}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">In Transit</option>
                    <option value="delivered">Completed</option>
                    <option value="onhold">On Hold</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;
