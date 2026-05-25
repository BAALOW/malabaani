import { createContext, useContext, useState } from "react";
import Notification from "../components/Notification";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {/* ✅ NOTIFICATIONS RENDER */}
      <div style={styles.container}>
        {notifications.map((n, index) => (
          <div key={n.id} style={{ marginBottom: "10px", transform: `translateY(${index * 10}px)` }}>
            <Notification
              message={n.message}
              type={n.type}
              onClose={() => removeNotification(n.id)}
            />
          </div>
        ))}
      </div>

    </NotificationContext.Provider>
  );
};

const styles = {
  container: {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 99999,
    display: "flex",
    flexDirection: "column",
  }
};

export const useNotification = () => useContext(NotificationContext);