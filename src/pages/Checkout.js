import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useShopContext from "../ShopContext";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import API from "../api";
import "../style.css";

const METHOD_COLORS = {
  EVC: "#16a34a",
  Zaad: "#2563eb",
  Sahal: "#f59e0b",
};

export default function Checkout() {
  const { products, total, clearCart } = useShopContext();
  const { user } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const { paymentMethod, phone } = location.state || {};

  const [loading, setLoading] = useState(false);
  const placedRef = useRef(false); // si redirect-ku u ordin marka order la dhammeeyo

  // Haddii xogta ama cart-ka la waayo, ku celi Cart
  useEffect(() => {
    if (placedRef.current) return;
    if (!paymentMethod || !phone || products.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [paymentMethod, phone, products, navigate]);

  if (!paymentMethod || !phone || (products.length === 0 && !placedRef.current)) {
    return null;
  }

  const itemsCount = products.reduce((n, p) => n + p.quantity, 0);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/orders/place",
        {
          items: products,
          total: total,
          paymentMethod,
          phone,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      placedRef.current = true;
      clearCart();
      showNotification("Order placed successfully! 🎉", "success");
      navigate("/orders", { replace: true });
    } catch (err) {
      console.log(err);
      showNotification("Order failed! Please try again ❌", "error");
      setLoading(false);
    }
  };

  return (
    <div className="co-page">
      {/* Progress steps */}
      <div className="co-steps">
        <div className="co-step done"><span>✓</span> Cart</div>
        <div className="co-line done" />
        <div className="co-step active"><span>2</span> Checkout</div>
        <div className="co-line" />
        <div className="co-step"><span>3</span> Confirmation</div>
      </div>

      <div className="co-header">
        <h1>Checkout</h1>
        <p>Review your order and confirm payment.</p>
      </div>

      <div className="co-layout">
        {/* LEFT */}
        <div className="co-left">
          {/* Customer */}
          <section className="co-card">
            <h2>Customer Details</h2>
            <div className="co-info-grid">
              <div>
                <small>Full name</small>
                <strong>{user?.name || "Customer"}</strong>
              </div>
              <div>
                <small>Email</small>
                <strong>{user?.email || "—"}</strong>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="co-card">
            <div className="co-card-head">
              <h2>Payment Method</h2>
              <Link to="/cart" className="co-edit">Change</Link>
            </div>
            <div className="co-pay">
              <span
                className="co-pay-badge"
                style={{ background: METHOD_COLORS[paymentMethod] || "#2563eb" }}
              >
                {paymentMethod}
              </span>
              <div>
                <strong>{paymentMethod} Mobile Money</strong>
                <small>Phone: {phone}</small>
              </div>
            </div>
            <p className="co-note">
              🔒 You will be asked to approve the payment on your phone after placing the order.
            </p>
          </section>

          {/* Items */}
          <section className="co-card">
            <div className="co-card-head">
              <h2>Order Items ({itemsCount})</h2>
              <Link to="/cart" className="co-edit">Edit cart</Link>
            </div>

            <div className="co-items">
              {products.map((p) => (
                <div key={p._id} className="co-item">
                  <img src={p.urlImage} alt={p.name} />
                  <div className="co-item-info">
                    <strong>{p.name}</strong>
                    <small>
                      ${Number(p.price).toFixed(2)} × {p.quantity}
                    </small>
                  </div>
                  <span className="co-item-total">
                    ${(Number(p.price) * p.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: summary */}
        <aside className="co-summary">
          <h2>Order Summary</h2>

          <div className="co-row">
            <span>Items ({itemsCount})</span>
            <span>${Number(total).toFixed(2)}</span>
          </div>
          <div className="co-row">
            <span>Payment</span>
            <span>{paymentMethod}</span>
          </div>

          <div className="co-divider" />

          <div className="co-row co-total">
            <span>Total</span>
            <span>${Number(total).toFixed(2)}</span>
          </div>

          <button
            className="co-place"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? "Placing order..." : `Place Order · $${Number(total).toFixed(2)}`}
          </button>

          <button
            className="co-back"
            onClick={() => navigate("/cart")}
            disabled={loading}
          >
            ← Back to Cart
          </button>

          <p className="co-secure">🔒 Secure checkout</p>
        </aside>
      </div>
    </div>
  );
}