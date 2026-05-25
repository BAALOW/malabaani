import "../../styles/admin.css";

const AdminSidebar = ({ activeTab, setActiveTab, orders, user, onLogout, onBackToSite }) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "orders",    label: "Orders",    icon: "📋" },
    { id: "users",     label: "Users",     icon: "👥" },
    { id: "foods",     label: "Foods",     icon: "🍕" },
    { id: "reviews",   label: "Reviews",   icon: "⭐" },
  ];

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "A";
  const pendingCount = orders.filter(o => o.status === "Pending").length;

  return (
    <>
      <div className="admin-sidebar-logo">
        🍽️ MALABAANI
        <span className="admin-sidebar-subtitle">Admin Dashboard</span>
      </div>

      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`admin-sidebar-item ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="admin-sidebar-icon">{tab.icon}</span>
          <span>{tab.label}</span>
          {tab.id === "orders" && pendingCount > 0 && (
            <span className="admin-notif-dot">{pendingCount}</span>
          )}
        </div>
      ))}

      <div className="admin-sidebar-item" onClick={onBackToSite}>
        <span className="admin-sidebar-icon">🏠</span>
        <span>Back to Site</span>
      </div>

      <div className="admin-sidebar-bottom">
        <div className="admin-info">
          <div className="admin-avatar">{avatarLetter}</div>
          <div>
            <p className="admin-name">{user?.name}</p>
            <p className="admin-role">Super Admin</p>
          </div>
        </div>
        <button className="admin-logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </>
  );
};

export default AdminSidebar;