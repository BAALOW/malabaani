import { useEffect, useState, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { FaClipboardList } from "react-icons/fa";
import ReviewModal from "../components/ReviewModal";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null); // ✅ ADDED

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  return (
    <div style={styles.page}>
      <h2 style={styles.title}><FaClipboardList /> My Orders</h2>

      {orders.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyText}>No orders yet! 🛒</p>
        </div>
      ) : (
        orders.map((order, index) => (
          <div key={index} style={styles.orderCard}>

            {/* ORDER HEADER */}
            <div style={styles.orderHeader}>
              <span style={styles.orderNumber}>Order #{index + 1}</span>
              <span style={styles.orderStatus}>{order.status}</span>
            </div>

            {/* ORDER DATE */}
            <p style={styles.orderDate}>
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric"
              })}
            </p>

            <div style={styles.divider} />

            {/* ORDER ITEMS */}
            {order.items.map((item, i) => (
              <div key={i} style={styles.itemRow}>
                <img src={item.urlImage} alt={item.name} style={styles.itemImage} />
                <span style={styles.itemName}>{item.name}</span>
                <span style={styles.itemQty}>x{item.quantity}</span>
                <span style={styles.itemPrice}>${item.price * item.quantity}</span>

                {/* ✅ WRITE REVIEW BUTTON */}
                <button
                  style={styles.reviewBtn}
                  onClick={() => setSelectedFood(item)}
                >
                  ⭐ Review
                </button>
              </div>
            ))}

            <div style={styles.divider} />

            {/* ORDER TOTAL */}
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalPrice}>${order.total}</span>
            </div>

          </div>
        ))
      )}

      {/* ✅ REVIEW MODAL */}
      {selectedFood && (
        <ReviewModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
          onSuccess={() => setSelectedFood(null)}
        />
      )}

    </div>
  );
};

const styles = {
  page: {
    maxWidth: "650px",
    margin: "30px auto",
    padding: "0 20px",
    fontFamily: "sans-serif"
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#222",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  emptyBox: {
    textAlign: "center",
    padding: "50px",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 2px 15px rgba(0,0,0,0.08)"
  },
  emptyText: {
    fontSize: "18px",
    color: "#888"
  },
  orderCard: {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 2px 15px rgba(0,0,0,0.08)"
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px"
  },
  orderNumber: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "#222"
  },
  orderStatus: {
    background: "#e8f5e9",
    color: "#2e7d32",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "bold"
  },
  orderDate: {
    color: "#888",
    fontSize: "13px",
    margin: "0 0 10px 0"
  },
  divider: {
    height: "1px",
    background: "#f0f0f0",
    margin: "10px 0"
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px"
  },
  itemImage: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    objectFit: "cover"
  },
  itemName: {
    flex: 1,
    fontSize: "14px",
    color: "#333"
  },
  itemQty: {
    color: "#888",
    fontSize: "14px"
  },
  itemPrice: {
    fontWeight: "bold",
    color: "#1a73e8",
    fontSize: "14px"
  },
  reviewBtn: {
    background: "#fff8e1",
    color: "#f59e0b",
    border: "1px solid #f59e0b",
    padding: "5px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: "15px",
    color: "#333"
  },
  totalPrice: {
    fontWeight: "bold",
    fontSize: "18px",
    color: "#1a73e8"
  }
};

export default Orders;