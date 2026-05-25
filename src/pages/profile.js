import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateProfile } from "../api";
import API from "../api";
import { FaUser, FaEnvelope, FaEdit, FaCheck } from "react-icons/fa";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/myorders");
        setOrderCount(res.data.length);
      } catch (err) { console.log(err); }
    };
    if (token) fetchOrders();
  }, [token]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get("/reviews/myreviews");
        setReviewCount(res.data.length);
      } catch (err) { console.log(err); }
    };
    if (token) fetchReviews();
  }, [token]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await API.get("/favorites/my-favorites");
        setFavoriteCount(res.data.length);
      } catch (err) { console.log(err); }
    };
    if (token) fetchFavorites();
  }, [token]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await updateProfile(token, { name, email });
      setUser(res.data);
      setIsEditing(false);
      alert("Profile updated successfully ✅");
    } catch (err) {
      console.log(err);
      alert("Update failed ❌");
    }
    setLoading(false);
  };

  if (!user) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div style={styles.page}>
      <div style={styles.topCard}>
        <div style={styles.avatar}>{avatarLetter}</div>
        <h2 style={styles.userName}>{user.name}</h2>
        <p style={styles.userEmail}>{user.email}</p>
      </div>

      <div style={styles.formCard}>
        <div style={styles.formHeader}>
          <h3 style={styles.formTitle}>My Information</h3>
          <button
            style={isEditing ? styles.saveBtn : styles.editBtn}
            onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
          >
            {isEditing ? <><FaCheck /> {loading ? "Saving..." : "Save"}</> : <><FaEdit /> Edit</>}
          </button>
        </div>

        <div style={styles.field}>
          <label style={styles.label}><FaUser style={styles.fieldIcon} /> Full Name</label>
          <input style={isEditing ? styles.inputActive : styles.inputDisabled} value={name} disabled={!isEditing} onChange={(e) => setName(e.target.value)} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}><FaEnvelope style={styles.fieldIcon} /> Email Address</label>
          <input style={isEditing ? styles.inputActive : styles.inputDisabled} value={email} disabled={!isEditing} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {isEditing && (
          <button style={styles.cancelBtn} onClick={() => { setIsEditing(false); setName(user.name); setEmail(user.email); }}>
            Cancel
          </button>
        )}
      </div>

      <div style={styles.statsCard}>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>{orderCount}</span>
          <span style={styles.statLabel}>Orders</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statNumber}>{favoriteCount}</span>
          <span style={styles.statLabel}>Favorites ❤️</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statNumber}>{reviewCount}</span>
          <span style={styles.statLabel}>Reviews</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "600px", margin: "30px auto", padding: "0 20px", fontFamily: "sans-serif" },
  topCard: { background: "linear-gradient(135deg, #1a73e8, #0d47a1)", borderRadius: "20px", padding: "40px 20px", textAlign: "center", color: "white", marginBottom: "20px", boxShadow: "0 4px 20px rgba(26,115,232,0.3)" },
  avatar: { width: "90px", height: "90px", borderRadius: "50%", background: "white", color: "#1a73e8", fontSize: "36px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 15px auto", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" },
  userName: { margin: "0 0 5px 0", fontSize: "24px", fontWeight: "bold" },
  userEmail: { margin: 0, opacity: 0.85, fontSize: "14px" },
  formCard: { background: "white", borderRadius: "20px", padding: "25px", marginBottom: "20px", boxShadow: "0 2px 15px rgba(0,0,0,0.08)" },
  formHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  formTitle: { margin: 0, fontSize: "18px", fontWeight: "bold", color: "#333" },
  editBtn: { display: "flex", alignItems: "center", gap: "6px", background: "#f0f4ff", color: "#1a73e8", border: "none", padding: "8px 16px", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" },
  saveBtn: { display: "flex", alignItems: "center", gap: "6px", background: "#1a73e8", color: "white", border: "none", padding: "8px 16px", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" },
  cancelBtn: { width: "100%", padding: "12px", marginTop: "10px", background: "#f5f5f5", color: "#666", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" },
  field: { marginBottom: "18px" },
  label: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#888", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" },
  fieldIcon: { color: "#1a73e8" },
  inputDisabled: { width: "100%", padding: "12px 15px", border: "2px solid #f0f0f0", borderRadius: "10px", fontSize: "15px", color: "#333", background: "#fafafa", boxSizing: "border-box", outline: "none" },
  inputActive: { width: "100%", padding: "12px 15px", border: "2px solid #1a73e8", borderRadius: "10px", fontSize: "15px", color: "#333", background: "white", boxSizing: "border-box", outline: "none" },
  statsCard: { background: "white", borderRadius: "20px", padding: "20px", display: "flex", justifyContent: "space-around", alignItems: "center", boxShadow: "0 2px 15px rgba(0,0,0,0.08)" },
  statItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" },
  statNumber: { fontSize: "24px", fontWeight: "bold", color: "#1a73e8" },
  statLabel: { fontSize: "13px", color: "#888" },
  statDivider: { width: "1px", height: "40px", background: "#eee" },
};