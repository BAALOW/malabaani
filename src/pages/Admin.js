import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useNotification } from "../context/NotificationContext";

import AdminSidebar   from "../components/admin/AdminSidebar";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminOrders    from "../components/admin/AdminOrders";
import AdminUsers     from "../components/admin/AdminUsers";
import AdminFoods     from "../components/admin/AdminFoods";
import AdminReviews   from "../components/admin/AdminReviews";

import "../style.css";

export default function Admin() {
  const { user, logout } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]           = useState("dashboard");
  const [stats, setStats]                   = useState({});
  const [users, setUsers]                   = useState([]);
  const [orders, setOrders]                 = useState([]);
  const [reviews, setReviews]               = useState([]);
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [searchFood, setSearchFood]         = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [newProduct, setNewProduct]         = useState({ name: "", urlImage: "", price: "", category: "fastfood" });
  const [editingProduct, setEditingProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen]       = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchStats    = async () => { try { const r = await API.get("/admin/stats",    { headers }); setStats(r.data);    } catch(e) {} };
  const fetchUsers    = async () => { try { const r = await API.get("/admin/users",    { headers }); setUsers(r.data);    } catch(e) {} };
  const fetchOrders   = async () => { try { const r = await API.get("/admin/orders",   { headers }); setOrders(r.data);   } catch(e) {} };
  const fetchReviews  = async () => { try { const r = await API.get("/admin/reviews",  { headers }); setReviews(r.data);  } catch(e) {} };
  const fetchProducts = async () => { try { const r = await API.get("/admin/products", { headers }); setProducts(r.data); } catch(e) {} };

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([fetchStats(), fetchUsers(), fetchOrders(), fetchReviews(), fetchProducts()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchName     = p.name.toLowerCase().includes(searchFood.toLowerCase());
    const matchCategory = searchCategory === "all" || p.category === searchCategory;
    return matchName && matchCategory;
  });

  const handleDeleteUser    = async (id) => { if (!window.confirm("Are you sure?")) return; try { await API.delete(`/admin/users/${id}`,   { headers }); setUsers(prev => prev.filter(u => u._id !== id)); fetchStats(); showNotification("User deleted ✅", "success"); } catch { showNotification("Delete failed ❌", "error"); } };
  const handleStatusChange  = async (orderId, status) => { try { await API.put(`/admin/orders/${orderId}`, { status }, { headers }); setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o)); showNotification(`Status updated to ${status} ✅`, "success"); } catch { showNotification("Update failed ❌", "error"); } };
  const handleDeleteReview  = async (id) => { if (!window.confirm("Are you sure?")) return; try { await API.delete(`/admin/reviews/${id}`, { headers }); setReviews(prev => prev.filter(r => r._id !== id)); showNotification("Review deleted ✅", "success"); } catch { showNotification("Update failed ❌", "error"); } };
  const handleDeleteProduct = async (id) => { if (!window.confirm("Are you sure?")) return; try { await API.delete(`/admin/products/${id}`, { headers }); setProducts(prev => prev.filter(p => p._id !== id)); fetchStats(); showNotification("Product deleted ✅", "success"); } catch { showNotification("Delete failed ❌", "error"); } };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.urlImage || !newProduct.price) { showNotification("Please fill all fields ❌", "error"); return; }
    try { const r = await API.post("/admin/products", { ...newProduct, price: parseFloat(newProduct.price) }, { headers }); setProducts(prev => [...prev, r.data]); setNewProduct({ name: "", urlImage: "", price: "", category: "fastfood" }); fetchStats(); showNotification("Product added ✅", "success"); } catch { showNotification("Add failed ❌", "error"); }
  };

  const handleUpdateProduct = async () => {
    try { const r = await API.put(`/admin/products/${editingProduct._id}`, { name: editingProduct.name, price: parseFloat(editingProduct.price), urlImage: editingProduct.urlImage, category: editingProduct.category }, { headers }); setProducts(prev => prev.map(p => p._id === editingProduct._id ? r.data : p)); setEditingProduct(null); showNotification("Product updated ✅", "success"); } catch { showNotification("Update failed ❌", "error"); }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  if (loading) return (
    <div className="admin-loading-page">
      <div>
        <div className="admin-spinner"></div>
        <p className="admin-loading-text">Loading Dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-layout">

      {/* ✅ HAMBURGER - MOBILE ONLY */}
      {!sidebarOpen && (
        <button
          className="admin-hamburger"
          onClick={() => setSidebarOpen(true)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}

      {/* ✅ OVERLAY */}
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ✅ SIDEBAR */}
      <div className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          orders={orders}
          user={user}
          onLogout={() => { logout(); navigate("/login"); }}
          onBackToSite={() => navigate("/home")}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-main">
        {activeTab === "dashboard" && (
          <AdminDashboard
            stats={stats}
            orders={orders}
            user={user}
            onStatusChange={handleStatusChange}
          />
        )}
        {activeTab === "orders" && (
          <AdminOrders
            orders={orders}
            onStatusChange={handleStatusChange}
          />
        )}
        {activeTab === "users" && (
          <AdminUsers
            users={users}
            onDeleteUser={handleDeleteUser}
          />
        )}
        {activeTab === "foods" && (
          <AdminFoods
            products={products}
            filteredProducts={filteredProducts}
            searchFood={searchFood}           setSearchFood={setSearchFood}
            searchCategory={searchCategory}   setSearchCategory={setSearchCategory}
            newProduct={newProduct}           setNewProduct={setNewProduct}
            editingProduct={editingProduct}   setEditingProduct={setEditingProduct}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProduct={handleUpdateProduct}
          />
        )}
        {activeTab === "reviews" && (
          <AdminReviews
            reviews={reviews}
            onDeleteReview={handleDeleteReview}
          />
        )}
      </div>

    </div>
  );
}