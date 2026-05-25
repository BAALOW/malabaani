import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // ✅ HADI USER MA JIRO - LOGIN U DIR
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ✅ HADI USER ADMIN MAAHA - HOME U DIR
  if (user.role !== "admin") {
    return <Navigate to="/home" />;
  }

  // ✅ ADMIN - SOCO
  return children;
};

export default AdminRoute;