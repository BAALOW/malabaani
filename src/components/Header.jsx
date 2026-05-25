import { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useShopContext from "../ShopContext";
import { AuthContext } from "../context/AuthContext";
import {
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaHeart,
  FaClipboardList,
  FaCog,
  FaUserCircle,
  FaBars,  // ✅ HAMBURGER ICON
  FaTimes  // ✅ CLOSE ICON
} from "react-icons/fa";

const Header = () => {
  const { products } = useShopContext();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false); // ✅ ADDED
  const dropdownRef = useRef(null);

  // ✅ CLOSE DROPDOWN OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ CLOSE MOBILE MENU MARKA PAGE BEDDELO
  const handleMobileLink = () => {
    setShowMobileMenu(false);
  };

  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <>
      <div className="menu">
        <Link to="/" className="logo">MALABAANI</Link>

        {/* ✅ DESKTOP LINKS */}
        <div className="links">
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div className="header-icons">

          {/* CART */}
          <Link to="/cart" className="cart-icon">
            <FaShoppingCart />
            {products.length > 0 && (
              <span className="cart-badge">{products.length}</span>
            )}
          </Link>

          {/* PROFILE DROPDOWN */}
          <div className="profile-wrapper" ref={dropdownRef}>
            <div
              className="avatar-circle"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FaUserCircle className="user-icon" />
            </div>

            {showDropdown && (
              <div className="dropdown">
                <div className="user-info">
                  <div className="user-avatar">{avatarLetter}</div>
                  <div>
                    <p className="user-name">{user?.name}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                </div>

                <div className="divider"></div>

                <Link to="/profile" className="menu-item" onClick={() => setShowDropdown(false)}>
                  <FaUser /> My Profile
                </Link>
                <Link to="/orders" className="menu-item" onClick={() => setShowDropdown(false)}>
                  <FaClipboardList /> My Orders
                </Link>
                <Link to="/favorites" className="menu-item" onClick={() => setShowDropdown(false)}>
                  <FaHeart /> Favorites
                </Link>
                <Link to="/settings" className="menu-item" onClick={() => setShowDropdown(false)}>
                  <FaCog /> Settings
                </Link>

                <div className="divider"></div>

                <div
                  className="logout-item"
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                    navigate("/login");
                  }}
                >
                  <FaSignOutAlt /> Logout
                </div>
              </div>
            )}
          </div>

          {/* ✅ HAMBURGER BUTTON - MOBILE KALIYA */}
          <button
            className="hamburger"
            onClick={() => setShowMobileMenu(true)}
          >
            <FaBars style={{ fontSize: "22px", color: "#1a73e8" }} />
          </button>

        </div>
      </div>

      {/* ✅ MOBILE OVERLAY */}
      {showMobileMenu && (
        <div
          className="mobile-overlay"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* ✅ MOBILE MENU */}
      <div className={`mobile-menu ${showMobileMenu ? "open" : ""}`}>

        {/* CLOSE BUTTON */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <span style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#1a73e8"
          }}>
            MALABAANI
          </span>
          <button
            onClick={() => setShowMobileMenu(false)}
            style={{
              background: "none",
              border: "none",
              fontSize: "22px",
              cursor: "pointer",
              color: "#333"
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* USER INFO */}
        {user && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px",
            background: "#f0f4ff",
            borderRadius: "10px",
            marginBottom: "10px"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#1a73e8",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "16px"
            }}>
              {avatarLetter}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>{user?.name}</p>
              <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>{user?.email}</p>
            </div>
          </div>
        )}

        {/* NAV LINKS */}
        <Link to="/home"     onClick={handleMobileLink}>🏠 Home</Link>
        <Link to="/about"    onClick={handleMobileLink}>ℹ️ About</Link>
        <Link to="/contact"  onClick={handleMobileLink}>📞 Contact</Link>
        <Link to="/cart"     onClick={handleMobileLink}>🛒 Cart {products.length > 0 && `(${products.length})`}</Link>

        <div style={{ height: "1px", background: "#f0f0f0", margin: "5px 0" }} />

        <Link to="/profile"   onClick={handleMobileLink}>👤 My Profile</Link>
        <Link to="/orders"    onClick={handleMobileLink}>📋 My Orders</Link>
        <Link to="/favorites" onClick={handleMobileLink}>❤️ Favorites</Link>
        <Link to="/settings"  onClick={handleMobileLink}>⚙️ Settings</Link>

        {/* ADMIN LINK - ADMIN KALIYA */}
        {user?.role === "admin" && (
          <Link to="/admin" onClick={handleMobileLink}
            style={{ color: "#e65100", fontWeight: "bold" }}
          >
            👑 Admin Dashboard
          </Link>
        )}

        <div style={{ height: "1px", background: "#f0f0f0", margin: "5px 0" }} />

        {/* LOGOUT */}
        <div
          onClick={() => {
            logout();
            setShowMobileMenu(false);
            navigate("/login");
          }}
          style={{
            display: "flex",
            gap: "10px",
            padding: "12px 10px",
            color: "red",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          <FaSignOutAlt /> Logout
        </div>

      </div>
    </>
  );
};

export default Header;