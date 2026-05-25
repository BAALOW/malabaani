import "../../styles/admin.css";

const AdminOrders = ({ orders, onStatusChange }) => {
  return (
    <>
      <h2 className="admin-page-title">📋 All Orders ({orders.length})</h2>
      <div className="admin-card">

        {/* ✅ DESKTOP TABLE */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={i}>
                  <td>#{i + 1}</td>
                  <td>
                    <div className="admin-user-row">
                      <div className="admin-u-avatar">
                        {order.user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: "13px", fontWeight: "bold" }}>
                          {order.user?.name || "User"}
                        </p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>
                          {order.user?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {order.items?.map((item, j) => (
                      <p key={j} style={{ margin: 0, fontSize: "12px", color: "#555" }}>
                        • {item.name} x{item.quantity}
                      </p>
                    ))}
                  </td>
                  <td><strong style={{ color: "#1a73e8" }}>${order.total}</strong></td>
                  <td>
                    <span className={`admin-badge ${
                      order.status === "Pending" ? "badge-pending" :
                      order.status === "Preparing" ? "badge-preparing" :
                      "badge-delivered"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="admin-select"
                      value={order.status}
                      onChange={(e) => onStatusChange(order._id, e.target.value)}
                    >
                      <option>Pending</option>
                      <option>Preparing</option>
                      <option>Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ MOBILE CARDS */}
        <div className="admin-mobile-card">
          {orders.map((order, i) => (
            <div key={i} className="admin-mobile-item">
              <div className="admin-mobile-item-header">
                <div className="admin-mobile-item-info">
                  <div className="admin-u-avatar">
                    {order.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="admin-mobile-item-name">{order.user?.name || "User"}</p>
                    <p className="admin-mobile-item-sub">{order.user?.email}</p>
                  </div>
                </div>
                <strong style={{ color: "#1a73e8", fontSize: "15px" }}>${order.total}</strong>
              </div>

              <div className="admin-mobile-item-row">
                <span>Items</span>
                <span style={{ textAlign: "right" }}>
                  {order.items?.map((item, j) => (
                    <span key={j} style={{ display: "block", fontSize: "12px" }}>
                      • {item.name} x{item.quantity}
                    </span>
                  ))}
                </span>
              </div>

              <div className="admin-mobile-item-row">
                <span>Status</span>
                <span className={`admin-badge ${
                  order.status === "Pending" ? "badge-pending" :
                  order.status === "Preparing" ? "badge-preparing" :
                  "badge-delivered"
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="admin-mobile-item-actions">
                <select
                  className="admin-select"
                  value={order.status}
                  onChange={(e) => onStatusChange(order._id, e.target.value)}
                  style={{ width: "100%", padding: "10px", fontSize: "13px" }}
                >
                  <option>Pending</option>
                  <option>Preparing</option>
                  <option>Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
};

export default AdminOrders;