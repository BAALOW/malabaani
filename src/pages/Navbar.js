import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import UserMenu from "./UserMenu";

// React Icons
import { FaUserCircle } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <div className="navbar">
      <h2>Shop</h2>

      {user && (
        <div className="user-box" onClick={() => setOpen(!open)}>
          
          {/* Avatar */}
          <img src={user.avatar} className="avatar" />

          {/* Name */}
          <span className="name">{user.name}</span>

          {/* Icons instead of emoji */}
          <FaCaretDown />

          {open && <UserMenu />}
        </div>
      )}

      {!user && (
        <div className="login-icon">
          <FaUserCircle size={25} />
        </div>
      )}
    </div>
  );
}