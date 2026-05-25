import "../../styles/admin.css";

const AdminDashboard = ({ stats, orders, user, onStatusChange }) => {
  return (
    <>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Dashboard</h2>
          <p className="admin-page-subtitle">Welcome back, {user?.name}! 👋</p>
        </div>
        <span className="admin-online-badge">🟢 System Online</span>
      </div>

      {/* STATS */}
      <div className="admin-stats-grid">
        {[
          { icon: "👥", bg: "#e8f0fe", num: stats.totalUsers    || 0, label: "Total Users"    },
          { icon: "📋", bg: "#e8f5e9", num: stats.totalOrders   || 0, label: "Total Orders"   },
          { icon: "💰", bg: "#fff8e1", num: `$${stats.totalRevenue || 0}`, label: "Total Revenue" },
          { icon: "🍕", bg: "#fce4ec", num: stats.totalProducts || 0, label: "Total Products" },
        ].map((s, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="admin-stat-number">{s.num}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS */}
      <div className="admin-card">
        <h3 className="admin-card-title">🕐 Recent Orders</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Change Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order, i) => (
              <tr key={i}>
                <td>
                  <div className="admin-user-row">
                    <div className="admin-u-avatar">
                      {order.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    {order.user?.name || "User"}
                  </div>
                </td>
                <td><strong style={{ color: "#1a73e8" }}>${order.total}</strong></td>
                <td>
                  <span className={`admin-badge ${
                    order.status === "Pending"   ? "badge-pending"   :
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
    </>
  );
};

export default AdminDashboard;