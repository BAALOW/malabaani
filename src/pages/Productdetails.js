import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api";
import "../styles/productDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [fav, setFav] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Alaabta
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);

        // 2. Related products
        try {
          const all = await api.get("/products");
          setRelated(
            all.data
              .filter((p) => p.category === data.category && p._id !== data._id)
              .slice(0, 4)
          );
        } catch {
          setRelated([]);
        }

        // 3. Reviews (hubi route-ka reviews ee backend-kaaga)
        try {
          const rev = await api.get(`/reviews/product/${id}`);
          setReviews(rev.data);
        } catch {
          setReviews([]);
        }
      } catch (err) {
        setError("Alaabtan lama helin.");
      } finally {
        setLoading(false);
      }
    };

    load();
    setQty(1);
    window.scrollTo(0, 0);
  }, [id]);

  const avgRating = reviews.length
    ? Number(
        (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      )
    : null;

  const handleAddToCart = () => {
    // TODO: ku xidh ShopContext sida Product.jsx u sameeyo.
    // Tusaale: dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity: qty } });
    alert(`${qty} x ${product.name} ayaa lagu daray cart-ka`);
  };

  if (loading) return <div className="pd-state">Loading...</div>;

  if (error || !product) {
    return (
      <div className="pd-state">
        <p>{error || "Alaabtan lama helin."}</p>
        <button onClick={() => navigate("/home")}>Ku noqo Home</button>
      </div>
    );
  }

  return (
    <div className="pd-page">
      {/* Breadcrumb */}
      <nav className="pd-breadcrumb">
        <Link to="/home">Home</Link> / <span>{product.category}</span> /{" "}
        <strong>{product.name}</strong>
      </nav>

      {/* Qeybta ugu weyn */}
      <div className="pd-main">
        <div className="pd-image">
          <img src={product.image} alt={product.name} />
          <button
            className="pd-fav"
            title="Favorite"
            onClick={() => setFav((f) => !f)}
          >
            {fav ? "♥" : "♡"}
          </button>
        </div>

        <div className="pd-info">
          <span className="pd-category">{product.category}</span>
          <h1>{product.name}</h1>

          <div className="pd-rating">
            {avgRating ? (
              <>
                <span className="pd-stars">
                  {"★".repeat(Math.round(avgRating))}
                  {"☆".repeat(5 - Math.round(avgRating))}
                </span>
                <strong>{avgRating}</strong>
                <span className="pd-muted">({reviews.length})</span>
              </>
            ) : (
              <span className="pd-muted">No reviews yet</span>
            )}
          </div>

          <div className="pd-price">${Number(product.price).toFixed(2)}</div>
          <p className="pd-desc">{product.description}</p>

          <div className="pd-actions">
            <div className="pd-qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button className="pd-add" onClick={handleAddToCart}>
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="pd-section">
        <h2>Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="pd-muted">Weli review ma jiro.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="pd-review">
              <strong>{r.user?.name || "User"}</strong>
              <span className="pd-stars">
                {" "}
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </span>
              <p>{r.comment}</p>
            </div>
          ))
        )}
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="pd-section">
          <h2>Related Products</h2>
          <div className="pd-related">
            {related.map((p) => (
              <Link to={`/product/${p._id}`} key={p._id} className="pd-card">
                <img src={p.image} alt={p.name} />
                <h4>{p.name}</h4>
                <span>${Number(p.price).toFixed(2)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}