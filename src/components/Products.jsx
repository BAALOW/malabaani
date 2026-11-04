import { useState, useEffect } from "react";
import Product from "./Product";
import API from "../api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Poppins:wght@400;500;600&display=swap');

  .pr-root {
    font-family: 'Poppins', sans-serif;
    padding: 72px 0 32px;
    scroll-margin-top: 110px;
  }

  /* ── Header row: title (left) + search (right) ── */
  .pr-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 28px;
    flex-wrap: wrap;
    margin-bottom: 30px;
  }

  .pr-head-text { max-width: 540px; }

  .pr-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: #2563eb;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.6px;
    text-transform: uppercase;
  }

  .pr-eyebrow::before {
    content: "";
    width: 28px;
    height: 2px;
    border-radius: 2px;
    background: #2563eb;
  }

  .pr-title {
    font-family: 'Sora', sans-serif;
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -1px;
    line-height: 1.12;
    margin: 12px 0 10px;
  }

  .pr-accent {
    background: linear-gradient(90deg, #2563eb, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .pr-desc {
    color: #64748b;
    font-size: 15px;
    line-height: 1.7;
    margin: 0;
  }

  /* ── Search ── */
  .pr-search {
    position: relative;
    width: 380px;
    max-width: 100%;
  }

  .pr-search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
    display: flex;
  }

  .pr-search input {
    width: 100%;
    height: 54px;
    padding: 0 62px 0 48px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    font-family: inherit;
    font-size: 15px;
    color: #0f172a;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }

  .pr-search input::placeholder { color: #94a3b8; }

  .pr-search input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.14), 0 4px 16px rgba(15, 23, 42, 0.06);
  }

  .pr-search-btn {
    position: absolute;
    right: 7px;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: 0;
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 6px 14px rgba(37, 99, 235, 0.35);
    transition: transform 0.2s, filter 0.2s;
  }

  .pr-search-btn:hover { transform: translateY(-50%) scale(1.05); filter: brightness(1.08); }

  /* ── Toolbar: tabs (left) + count (right) ── */
  .pr-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    padding-bottom: 22px;
    margin-bottom: 28px;
    border-bottom: 1px solid #eef0f4;
  }

  .pr-tabs {
    display: inline-flex;
    gap: 4px;
    padding: 5px;
    background: #f1f5f9;
    border-radius: 16px;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .pr-tabs::-webkit-scrollbar { display: none; }

  .pr-tab {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: transparent;
    color: #64748b;
    border: 0;
    border-radius: 12px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  }

  .pr-tab:hover { color: #0f172a; }

  .pr-tab.active {
    background: #fff;
    color: #2563eb;
    font-weight: 600;
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.09);
  }

  .pr-tab-icon { font-size: 16px; line-height: 1; }

  .pr-tab-count {
    min-width: 24px;
    height: 20px;
    padding: 0 7px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: #e2e8f0;
    color: #475569;
    font-size: 11px;
    font-weight: 600;
  }

  .pr-tab.active .pr-tab-count { background: #dbeafe; color: #2563eb; }

  .pr-tab:focus-visible,
  .pr-search-btn:focus-visible {
    outline: 3px solid rgba(147, 197, 253, 0.8);
    outline-offset: 2px;
  }

  .pr-count { color: #94a3b8; font-size: 14px; margin: 0; }
  .pr-count strong { color: #0f172a; font-weight: 600; }

  /* ── Grid ── */
  .pr-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 26px;
  }

  .pr-item { animation: prFadeUp 0.5s ease backwards; }

  @keyframes prFadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Empty ── */
  .pr-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 64px 16px;
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    border-radius: 20px;
  }
  .pr-empty-icon { font-size: 42px; margin-bottom: 8px; }
  .pr-empty-title { font-size: 17px; font-weight: 600; color: #334155; margin: 0; }
  .pr-empty-sub { font-size: 14px; color: #94a3b8; margin: 6px 0 0; }

  /* ── Skeleton ── */
  .pr-skel {
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 14px rgba(0,0,0,0.05);
  }
  .pr-skel-img, .pr-skel-line, .pr-skel-btn {
    background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 37%, #f1f5f9 63%);
    background-size: 400% 100%;
    animation: prShimmer 1.4s ease infinite;
  }
  .pr-skel-img { height: 250px; }
  .pr-skel-body { padding: 14px; display: flex; flex-direction: column; gap: 12px; }
  .pr-skel-line { height: 14px; border-radius: 8px; width: 60%; }
  .pr-skel-line.short { width: 35%; }
  .pr-skel-btn { height: 40px; border-radius: 10px; }

  @keyframes prShimmer {
    0%   { background-position: 100% 50%; }
    100% { background-position: 0 50%; }
  }

  /* ── Responsive ── */
  @media (max-width: 820px) {
    .pr-head { align-items: stretch; flex-direction: column; gap: 20px; }
    .pr-search { width: 100%; }
  }

  @media (max-width: 680px) {
    .pr-root { padding-top: 48px; }
    .pr-grid { grid-template-columns: 1fr; gap: 20px; }
    .pr-toolbar { flex-direction: column; align-items: stretch; gap: 12px; }
    .pr-count { text-align: left; }
  }

  @media (prefers-reduced-motion: reduce) {
    .pr-item, .pr-skel-img, .pr-skel-line, .pr-skel-btn { animation: none; }
  }
`;

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

  // (muuqaal kaliya) tirada alaabta ee tab kasta
  const countFor = (key) =>
    key === "all" ? products.length : products.filter((p) => p.category === key).length;

  if (loading)
    return (
      <>
        <style>{styles}</style>
        <section id="menu" className="pr-root">
          <div className="pr-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="pr-skel">
                <div className="pr-skel-img" />
                <div className="pr-skel-body">
                  <div className="pr-skel-line" />
                  <div className="pr-skel-line short" />
                  <div className="pr-skel-btn" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );

  return (
    <>
      <style>{styles}</style>

      <section id="menu" className="pr-root">
        {/* ── HEADER: title left, search right ── */}
        <div className="pr-head">
          <div className="pr-head-text">
            <span className="pr-eyebrow">Fresh &amp; Delicious</span>
            <h2 className="pr-title">
              Explore our <span className="pr-accent">menu</span>
            </h2>
            <p className="pr-desc">
              Choose your favorite category and discover delicious food.
            </p>
          </div>

          <div className="pr-search">
            <span className="pr-search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="pr-search-btn" aria-label="Search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── TOOLBAR: category tabs + count ── */}
        <div className="pr-toolbar">
          <div className="pr-tabs">
            {[
              { key: "all",      label: "All",      icon: "🍽️" },
              { key: "fastfood", label: "Food",     icon: "🍔" },
              { key: "drinks",   label: "Drinks",   icon: "🥤" },
              { key: "desserts", label: "Desserts", icon: "🍰" },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                className={`pr-tab ${category === key ? "active" : ""}`}
                onClick={() => setCategory(key)}
              >
                <span className="pr-tab-icon">{icon}</span>
                {label}
                <span className="pr-tab-count">{countFor(key)}</span>
              </button>
            ))}
          </div>

          <p className="pr-count">
            Showing <strong>{filteredProducts.length}</strong>{" "}
            {filteredProducts.length === 1 ? "item" : "items"}
          </p>
        </div>

        {/* ── PRODUCTS GRID ── */}
        <div className="pr-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, i) => (
              <div
                key={product._id}
                className="pr-item"
                style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
              >
                <Product product={product} />
              </div>
            ))
          ) : (
            <div className="pr-empty">
              <div className="pr-empty-icon">🍽️</div>
              <p className="pr-empty-title">No products found</p>
              <p className="pr-empty-sub">Try a different keyword or category.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Products;