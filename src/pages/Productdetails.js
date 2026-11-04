import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api";
import useShopContext from "../ShopContext";
import "../style.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products: cartItems, addToCart, removeFromCart } = useShopContext();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [qty, setQty] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isInCart = product
    ? cartItems.some((p) => p._id === product._id)
    : false;

  // Soo qaado alaabta, related, reviews, favorite
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        setQty(1);

        const { data } = await API.get(`/products/${id}`);
        setProduct(data);

        // Related products
        try {
          const all = await API.get("/products");
          let list = all.data.filter((p) => p._id !== data._id);
          if (data.category) {
            const sameCat = list.filter((p) => p.category === data.category);
            if (sameCat.length > 0) list = sameCat;
          }
          setRelated(list.slice(0, 4));
        } catch {
          setRelated([]);
        }

        // Reviews
        try {
          const rev = await API.get(`/reviews/food/${data.name}`);
          setAvgRating(parseFloat(rev.data.avgRating) || 0);
          setTotalReviews(rev.data.totalReviews || 0);
          setReviews(rev.data.reviews || []);
        } catch {
          setAvgRating(0);
          setTotalReviews(0);
          setReviews([]);
        }

        // Favorite
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const fav = await API.get("/favorites/my-favorites");
            setIsFavorite(!!fav.data.find((f) => f.productName === data.name));
          } else {
            setIsFavorite(false);
          }
        } catch {
          setIsFavorite(false);
        }
      } catch (err) {
        setError("Alaabtan lama helin.");
      } finally {
        setLoading(false);
      }
    };

    load();
    window.scrollTo(0, 0);
  }, [id]);

  const handleCart = () => {
    if (isInCart) {
      removeFromCart(product._id);
    } else {
      for (let i = 0; i < qty; i++) addToCart(product);
    }
  };

  const handleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add favorites!");
      return;
    }
    try {
      const res = await API.post("/favorites/toggle", {
        productName: product.name,
      });
      setIsFavorite(res.data.isFavorite);
    } catch (err) {
      console.log(err);
    }
  };

  const stars = (n) => {
    const r = Math.round(n);
    return "★".repeat(r) + "☆".repeat(5 - r);
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
      <nav className="pd-breadcrumb">
        <Link to="/home">Home</Link> /{" "}
        {product.category && <span>{product.category} / </span>}
        <strong>{product.name}</strong>
      </nav>

      <div className="pd-main">
        <div className="pd-image">
          <img src={product.urlImage} alt={product.name} />
          <button
            className={`pd-fav ${isFavorite ? "active" : ""}`}
            title="Favorite"
            onClick={handleFavorite}
          >
            {isFavorite ? "♥" : "♡"}
          </button>
        </div>

        <div className="pd-info">
          {product.category && (
            <span className="pd-category">{product.category}</span>
          )}
          <h1>{product.name}</h1>

          <div className="pd-rating">
            {totalReviews > 0 ? (
              <>
                <span className="pd-stars">{stars(avgRating)}</span>
                <strong>{avgRating}</strong>
                <span className="pd-muted">({totalReviews})</span>
              </>
            ) : (
              <span className="pd-muted">No reviews yet</span>
            )}
          </div>

          <div className="pd-price">${Number(product.price).toFixed(2)}</div>

          {product.description && (
            <p className="pd-desc">{product.description}</p>
          )}

          <div className="pd-actions">
            {!isInCart && (
              <div className="pd-qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
            )}
            <button
              className={`pd-add ${isInCart ? "remove" : ""}`}
              onClick={handleCart}
            >
              🛒 {isInCart ? "Remove from Cart" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      <section className="pd-section">
        <h2>Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="pd-muted">Weli review ma jiro.</p>
        ) : (
          reviews.map((r, i) => (
            <div key={r._id || i} className="pd-review">
              <strong>{r.user?.name || "User"}</strong>
              <span className="pd-stars"> {stars(r.rating)}</span>
              <p>"{r.comment}"</p>
            </div>
          ))
        )}
      </section>

      {related.length > 0 && (
        <section className="pd-section">
          <h2>Related Products</h2>
          <div className="pd-related">
            {related.map((p) => (
              <Link to={`/product/${p._id}`} key={p._id} className="pd-card">
                <img src={p.urlImage} alt={p.name} />
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