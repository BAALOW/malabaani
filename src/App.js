import Header from "./components/Header";
import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Getstarted from "./pages/Getstarted";
import Login from "./pages/Login";
import SignUp from "./pages/SingUp";
import Profile from "./pages/profile";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import Favorites from "./pages/Favorites";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import AIChatbot from "./components/AIChatbot";

import "./style.css";

const App = () => {
  const [cart, setCart] = useState(5);
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const hideHeaderRoutes = ["/", "/getstarted", "/login", "/signup", "/admin"];

  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="container">
          {!hideHeaderRoutes.includes(location.pathname) && (
            <Header cart={cart} setCart={setCart} />
          )}
          <Routes>
            <Route path="/" element={<Getstarted />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart setCart={setCart} />} />
          </Routes>
        </div>
        <AIChatbot />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;