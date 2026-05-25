import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import {
  FaUser, FaLock, FaBell, FaPalette,
  FaChevronRight, FaMoon, FaSun, FaCheck,
  FaEye, FaEyeSlash, FaShieldAlt
} from "react-icons/fa";

export default function Settings() {
  const { user, setUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("account");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ACCOUNT
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountMsg, setAccountMsg] = useState(null);

  // SECURITY
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityMsg, setSecurityMsg] = useState(null);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // NOTIFICATIONS — localStorage ka load
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : {
      orderUpdates: true,
      promotions: false,
      newItems: true,
    };
  });
  const [notifMsg, setNotifMsg] = useState(null);

  // APPEARANCE
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // ✅ SHOW MESSAGE — auto hide after 3s
  const showMsg = (setter, type, text) => {
    setter({ type, text });
    setTimeout(() => setter(null), 3000);
  };

  // ✅ DARK MODE
  const handleDarkMode = (isDark) => {
    setDarkMode(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  // ✅ ACCOUNT UPDATE — real API
  const handleAccountUpdate = async () => {
    if (!name.trim() || !email.trim()) {
      showMsg(setAccountMsg, "error", "Name and email are required!");
      return;
    }
    setAccountLoading(true);
    try {
      const res = await API.put("/user/profile", { name, email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      showMsg(setAccountMsg, "success", "Account updated successfully!");
    } catch (err) {
      showMsg(setAccountMsg, "error", err.response?.data?.msg || "Update failed. Try again.");
    }
    setAccountLoading(false);
  };

  // ✅ PASSWORD CHANGE — real API with validation
  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showMsg(setSecurityMsg, "error", "Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showMsg(setSecurityMsg, "error", "New passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      showMsg(setSecurityMsg, "error", "Password must be at least 6 characters.");
      return;
    }
    if (oldPassword === newPassword) {
      showMsg(setSecurityMsg, "error", "New password must be different from current password.");
      return;
    }
    setSecurityLoading(true);
    try {
      await API.put("/user/password", { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMsg(setSecurityMsg, "success", "Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showMsg(setSecurityMsg, "error", err.response?.data?.msg || "Incorrect current password.");
    }
    setSecurityLoading(false);
  };

  // ✅ NOTIFICATIONS — localStorage ku kaydso
  const handleNotifToggle = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
    showMsg(setNotifMsg, "success", `${key === "orderUpdates" ? "Order Updates" : key === "promotions" ? "Promotions" : "New Items"} ${updated[key] ? "enabled" : "disabled"}.`);
  };

  const tabs = [
    { id: "account", label: "Account", icon: <FaUser /> },
    { id: "security", label: "Security", icon: <FaLock /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "appearance", label: "Appearance", icon: <FaPalette /> },
  ];

  // Password strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: "Too short", color: "#ef4444", width: "20%" };
    if (pwd.length < 8) return { label: "Weak", color: "#f97316", width: "40%" };
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { label: "Fair", color: "#eab308", width: "60%" };
    if (pwd.length >= 10) return { label: "Strong", color: "#22c55e", width: "100%" };
    return { label: "Good", color: "#3b82f6", width: "80%" };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px", fontFamily: "Segoe UI, sans-serif" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 20 }}>⚙️ Settings</h2>

      <div style={{ display: "flex", gap: 16, flexDirection: isMobile ? "column" : "row" }}>

        {/* SIDEBAR */}
        <div style={{
          width: isMobile ? "100%" : 200,
          background: "white",
          borderRadius: 16,
          padding: isMobile ? "6px" : 8,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          height: "fit-content",
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          gap: isMobile ? 4 : 2,
          flexShrink: 0,
        }}>
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: isMobile ? "center" : "flex-start",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 4 : 10,
                padding: isMobile ? "10px 0" : "11px 12px",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: isMobile ? 11 : 13,
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? "#1a73e8" : "#888",
                background: activeTab === tab.id ? "#eff6ff" : "transparent",
                transition: "all 0.2s",
                flex: isMobile ? 1 : "unset",
                textAlign: "center",
              }}
            >
              <span style={{
                fontSize: isMobile ? 18 : 14,
                color: activeTab === tab.id ? "#1a73e8" : "#aaa"
              }}>{tab.icon}</span>
              <span style={{ lineHeight: 1.2 }}>{tab.label}</span>
              {!isMobile && <FaChevronRight style={{ marginLeft: "auto", fontSize: 11, color: "#ccc" }} />}
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1 }}>

          {/* ── ACCOUNT ── */}
          {activeTab === "account" && (
            <div style={card}>
              <h3 style={cardTitle}><FaUser style={{ color: "#1a73e8" }} /> Account Information</h3>

              {accountMsg && <Alert type={accountMsg.type} text={accountMsg.text} />}

              {/* Avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, padding: "14px 16px", background: "#f8faff", borderRadius: 12 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "linear-gradient(135deg, #1a73e8, #0d47a1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, color: "white", fontWeight: 700, flexShrink: 0
                }}>
                  {(user?.name || "U")[0].toUpperCase()}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>{user?.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{user?.email}</p>
                  <span style={{ fontSize: 11, background: "#eff6ff", color: "#1a73e8", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>
                    {user?.role || "user"}
                  </span>
                </div>
              </div>

              <Field label="Full Name">
                <input style={input} value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
              </Field>

              <Field label="Email Address">
                <input style={input} value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" />
              </Field>

              <button style={saveBtn} onClick={handleAccountUpdate} disabled={accountLoading}>
                {accountLoading ? "Saving..." : "Save Changes ✅"}
              </button>
            </div>
          )}

          {/* ── SECURITY ── */}
          {activeTab === "security" && (
            <div style={card}>
              <h3 style={cardTitle}><FaShieldAlt style={{ color: "#1a73e8" }} /> Security</h3>

              {securityMsg && <Alert type={securityMsg.type} text={securityMsg.text} />}

              <div style={{ padding: "12px 16px", background: "#f0f9ff", borderRadius: 10, marginBottom: 20, fontSize: 13, color: "#0369a1" }}>
                🔒 Choose a strong password with at least 6 characters, including numbers and uppercase letters.
              </div>

              <Field label="Current Password">
                <div style={passWrap}>
                  <input style={{ ...input, paddingRight: 44 }} type={showOld ? "text" : "password"}
                    value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Enter current password" />
                  <span style={eyeBtn} onClick={() => setShowOld(!showOld)}>
                    {showOld ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Field>

              <Field label="New Password">
                <div style={passWrap}>
                  <input style={{ ...input, paddingRight: 44 }} type={showNew ? "text" : "password"}
                    value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" />
                  <span style={eyeBtn} onClick={() => setShowNew(!showNew)}>
                    {showNew ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {/* Password strength bar */}
                {newPassword && strength && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ height: 4, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: strength.width, background: strength.color, borderRadius: 4, transition: "all 0.3s" }} />
                    </div>
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: strength.color, fontWeight: 600 }}>{strength.label}</p>
                  </div>
                )}
              </Field>

              <Field label="Confirm New Password">
                <div style={passWrap}>
                  <input style={{
                    ...input, paddingRight: 44,
                    borderColor: confirmPassword && confirmPassword !== newPassword ? "#ef4444" : confirmPassword && confirmPassword === newPassword ? "#22c55e" : "#f0f0f0"
                  }}
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
                  <span style={eyeBtn} onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#ef4444" }}>Passwords do not match</p>
                )}
                {confirmPassword && confirmPassword === newPassword && (
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#22c55e" }}>✓ Passwords match</p>
                )}
              </Field>

              <button style={saveBtn} onClick={handlePasswordChange} disabled={securityLoading}>
                {securityLoading ? "Changing..." : "Change Password 🔒"}
              </button>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === "notifications" && (
            <div style={card}>
              <h3 style={cardTitle}><FaBell style={{ color: "#1a73e8" }} /> Notifications</h3>

              {notifMsg && <Alert type={notifMsg.type} text={notifMsg.text} />}

              <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
                Your notification preferences are saved to this device.
              </p>

              {[
                {
                  key: "orderUpdates",
                  title: "Order Updates",
                  desc: "Get notified when your order status changes",
                  icon: "📦"
                },
                {
                  key: "promotions",
                  title: "Promotions & Offers",
                  desc: "Receive discount offers and special promotions",
                  icon: "🎉"
                },
                {
                  key: "newItems",
                  title: "New Menu Items",
                  desc: "Get notified when new food is added to the menu",
                  icon: "🍽️"
                }
              ].map((item, i, arr) => (
                <div key={item.key}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ fontSize: 22 }}>{item.icon}</span>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#1a1a2e" }}>{item.title}</p>
                        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#888" }}>{item.desc}</p>
                      </div>
                    </div>
                    {/* Toggle */}
                    <div
                      onClick={() => handleNotifToggle(item.key)}
                      style={{
                        width: 46, height: 24, borderRadius: 20,
                        background: notifications[item.key] ? "#1a73e8" : "#ddd",
                        cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0
                      }}
                    >
                      <div style={{
                        width: 20, height: 20, background: "white", borderRadius: "50%",
                        position: "absolute", top: 2, left: 2,
                        transition: "transform 0.3s",
                        transform: notifications[item.key] ? "translateX(22px)" : "translateX(0)",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)"
                      }} />
                    </div>
                  </div>
                  {i < arr.length - 1 && <div style={{ height: 1, background: "#f4f4f4" }} />}
                </div>
              ))}

              {/* Summary */}
              <div style={{ marginTop: 20, padding: "12px 16px", background: "#f8faff", borderRadius: 10, fontSize: 13, color: "#555" }}>
                ℹ️ Currently enabled: <strong style={{ color: "#1a73e8" }}>
                  {Object.values(notifications).filter(Boolean).length} of {Object.keys(notifications).length}
                </strong> notifications
              </div>
            </div>
          )}

          {/* ── APPEARANCE ── */}
          {activeTab === "appearance" && (
            <div style={card}>
              <h3 style={cardTitle}><FaPalette style={{ color: "#1a73e8" }} /> Appearance</h3>

              <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Choose your preferred theme</p>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {/* Light */}
                <div onClick={() => handleDarkMode(false)} style={{
                  flex: 1, minWidth: 130, padding: 20, borderRadius: 14,
                  border: !darkMode ? "2px solid #1a73e8" : "2px solid #eee",
                  cursor: "pointer", textAlign: "center", background: "white",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                  transition: "all 0.2s", boxShadow: !darkMode ? "0 4px 16px rgba(26,115,232,0.15)" : "none"
                }}>
                  <FaSun style={{ fontSize: 32, color: "#f59e0b" }} />
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#333" }}>Light Mode</p>
                  {!darkMode && (
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#1a73e8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FaCheck style={{ color: "white", fontSize: 11 }} />
                    </div>
                  )}
                </div>

                {/* Dark */}
                <div onClick={() => handleDarkMode(true)} style={{
                  flex: 1, minWidth: 130, padding: 20, borderRadius: 14,
                  border: darkMode ? "2px solid #1a73e8" : "2px solid #eee",
                  cursor: "pointer", textAlign: "center",
                  background: darkMode ? "#1e1e2e" : "white",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                  transition: "all 0.2s", boxShadow: darkMode ? "0 4px 16px rgba(26,115,232,0.15)" : "none"
                }}>
                  <FaMoon style={{ fontSize: 32, color: darkMode ? "#a78bfa" : "#94a3b8" }} />
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: darkMode ? "white" : "#333" }}>Dark Mode</p>
                  {darkMode && (
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#1a73e8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FaCheck style={{ color: "white", fontSize: 11 }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── HELPERS ──
const Alert = ({ type, text }) => (
  <div style={{
    padding: "10px 14px", borderRadius: 10, marginBottom: 16, fontSize: 13, fontWeight: 600,
    background: type === "success" ? "#f0fdf4" : "#fef2f2",
    color: type === "success" ? "#16a34a" : "#dc2626",
    border: `1px solid ${type === "success" ? "#bbf7d0" : "#fecaca"}`,
    display: "flex", alignItems: "center", gap: 8
  }}>
    {type === "success" ? "✅" : "❌"} {text}
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ fontSize: 12, color: "#888", fontWeight: 700, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>
    {children}
  </div>
);

// ── STYLES ──
const card = {
  background: "white", borderRadius: 16, padding: 24,
  boxShadow: "0 2px 15px rgba(0,0,0,0.08)"
};
const cardTitle = {
  fontSize: 17, fontWeight: 700, color: "#1a1a2e",
  marginBottom: 20, display: "flex", alignItems: "center", gap: 10
};
const input = {
  width: "100%", padding: "11px 14px", border: "2px solid #f0f0f0",
  borderRadius: 10, fontSize: 14, color: "#333", background: "#fafafa",
  boxSizing: "border-box", outline: "none", transition: "border 0.2s"
};
const saveBtn = {
  width: "100%", padding: 13, background: "linear-gradient(135deg, #1a73e8, #0d47a1)",
  color: "white", border: "none", borderRadius: 10, fontSize: 15,
  fontWeight: 700, cursor: "pointer", marginTop: 8, transition: "opacity 0.2s"
};
const passWrap = { position: "relative" };
const eyeBtn = {
  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
  cursor: "pointer", color: "#aaa", fontSize: 15
};