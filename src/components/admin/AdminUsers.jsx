import "../../styles/admin.css";

const AdminUsers = ({ users, onDeleteUser }) => {
  return (
    <>
      <h2 className="admin-page-title">👥 All Users ({users.length})</h2>
      <div className="admin-card">

        {/* ✅ DESKTOP TABLE */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    <div className="admin-user-row">
                      <div className="admin-u-avatar" style={{
                        background: u.role === "admin" ? "#f59e0b" : "#1a73e8"
                      }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`admin-badge ${u.role === "admin" ? "badge-admin" : "badge-user"}`}>
                      {u.role === "admin" ? "👑 Admin" : "👤 User"}
                    </span>
                  </td>
                  <td>
                    {new Date(u.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric"
                    })}
                  </td>
                  <td>
                    <button className="admin-delete-btn" onClick={() => onDeleteUser(u._id)}>
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ MOBILE CARDS */}
        <div className="admin-mobile-card">
          {users.map((u, i) => (
            <div key={i} className="admin-mobile-item">
              <div className="admin-mobile-item-header">
                <div className="admin-mobile-item-info">
                  <div className="admin-u-avatar" style={{
                    background: u.role === "admin" ? "#f59e0b" : "#1a73e8",
                    width: "42px", height: "42px", fontSize: "16px"
                  }}>
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="admin-mobile-item-name">{u.name}</p>
                    <p className="admin-mobile-item-sub">{u.email}</p>
                  </div>
                </div>
                <span className={`admin-badge ${u.role === "admin" ? "badge-admin" : "badge-user"}`}>
                  {u.role === "admin" ? "👑 Admin" : "👤 User"}
                </span>
              </div>

              <div className="admin-mobile-item-row">
                <span>Joined</span>
                <span>{new Date(u.createdAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "short", day: "numeric"
                })}</span>
              </div>

              <div className="admin-mobile-item-actions">
                <button className="admin-delete-btn" onClick={() => onDeleteUser(u._id)}>
                  🗑 Delete User
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
};

export default AdminUsers;