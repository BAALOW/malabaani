import { useEffect } from "react";

const Notification = ({ message, type, onClose }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // ✅ 3 seconds ka dib auto close
    return () => clearTimeout(timer);
  }, []);

  const getStyle = () => {
    if (type === "success") return styles.success;
    if (type === "error") return styles.error;
    if (type === "info") return styles.info;
    return styles.success;
  };

  const getIcon = () => {
    if (type === "success") return "✅";
    if (type === "error") return "❌";
    if (type === "info") return "ℹ️";
    return "✅";
  };

  return (
    <div style={{ ...styles.notification, ...getStyle() }}>
      <span style={styles.icon}>{getIcon()}</span>
      <span style={styles.message}>{message}</span>
      <button style={styles.closeBtn} onClick={onClose}>✕</button>
    </div>
  );
};

const styles = {
  notification: {
    position: "fixed",
    top: "20px",
    right: "20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 20px",
    borderRadius: "14px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
    zIndex: 99999,
    minWidth: "300px",
    maxWidth: "400px",
    animation: "slideIn 0.3s ease",
  },
  success: {
    background: "linear-gradient(135deg, #00b09b, #96c93d)",
    color: "white",
  },
  error: {
    background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
    color: "white",
  },
  info: {
    background: "linear-gradient(135deg, #1a73e8, #0d47a1)",
    color: "white",
  },
  icon: {
    fontSize: "20px",
  },
  message: {
    flex: 1,
    fontSize: "14px",
    fontWeight: "600",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    padding: "0",
    opacity: 0.8,
  },
};

export default Notification;