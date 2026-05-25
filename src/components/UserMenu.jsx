import { useNavigate } from "react-router-dom";

// React Icons
import { FaUser, FaBox, FaHeart, FaMapMarkerAlt, FaCog, FaSignOutAlt } from "react-icons/fa";

export default function UserMenu() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="dropdown">

      <p onClick={() => navigate("/profile")}>
        <FaUser /> My Profile
      </p>

      <p onClick={() => navigate("/orders")}>
        <FaBox /> My Orders
      </p>

      <p onClick={() => navigate("/favorites")}>
        <FaHeart /> Favorites
      </p>

      <p onClick={() => navigate("/address")}>
        <FaMapMarkerAlt /> Address Book
      </p>

      <p onClick={() => navigate("/settings")}>
        <FaCog /> Settings
      </p>

      <p onClick={logout} className="logout">
        <FaSignOutAlt /> Logout
      </p>

    </div>
  );
}