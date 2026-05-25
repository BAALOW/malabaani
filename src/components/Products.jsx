import { useState, useEffect } from "react";
import Product from "./Product";
import API from "../api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ API KA SOO KEEN PRODUCTS-KA
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchCategory = category === "all" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  return (
    <>
      {/* ── SECTION HEADER ── */}
      <div className="section-header">
        <h2 className="section-title">Categories</h2>
        <div className="section-underline" />
        <p className="section-desc">Choose your favorite category and discover delicious food.</p>
      </div>

      {/* ── CATEGORY BUTTONS ── */}
      <div className="category-buttons">
        {[
          { key: "all",      label: "All",      icon: "⊞" },
          { key: "fastfood", label: "Food",     icon: "🍔" },
          { key: "drinks",   label: "Drinks",   icon: "🥤" },
          { key: "desserts", label: "Desserts", icon: "🍰" },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            className={`cat-btn ${category === key ? "active" : ""}`}
            onClick={() => setCategory(key)}
          >
            <span className="cat-icon">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* ── SEARCH ── */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-btn" aria-label="Search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      {/* ── PRODUCTS GRID ── */}
      <div className="grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Product key={product._id} product={product} />
          ))
        ) : (
          <p style={{ textAlign: "center", gridColumn: "1/-1", color: "#888" }}>
            No products found
          </p>
        )}
      </div>
    </>
  );
};

export default Products;