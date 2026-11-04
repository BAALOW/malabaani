import { Link } from "react-router-dom";
import useShopContext from "../ShopContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Poppins:wght@400;500;600&display=swap');

  .cp-root {
    font-family: 'Poppins', sans-serif;
    width: 100%;
    background: #fff;
    border: 1px solid #eef0f4;
    border-radius: 22px;
    box-shadow: 0 10px 34px rgba(15, 23, 42, 0.06);
    overflow: hidden;
  }

  .cp-root *, .cp-root *::before, .cp-root *::after { box-sizing: border-box; }

  /* ── Header ── */
  .cp-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 22px 26px;
    border-bottom: 1px solid #eef0f4;
  }

  .cp-title {
    font-family: 'Sora', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.3px;
    margin: 0;
  }

  .cp-badge {
    background: #eff6ff;
    color: #2563eb;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 14px;
    border-radius: 999px;
    white-space: nowrap;
  }

  /* ── List ── */
  .cp-list { display: flex; flex-direction: column; }

  .cp-item {
    display: grid;
    grid-template-columns: 84px 1fr auto auto auto;
    align-items: center;
    gap: 18px;
    padding: 18px 26px;
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.2s;
    animation: cpIn 0.4s ease backwards;
  }

  .cp-item:last-child { border-bottom: 0; }
  .cp-item:hover { background: #fafbfd; }

  @keyframes cpIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cp-img {
    width: 84px;
    height: 84px;
    border-radius: 16px;
    object-fit: cover;
    display: block;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12);
  }

  .cp-info { min-width: 0; }

  .cp-name {
    display: block;
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    text-transform: capitalize;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cp-unit {
    display: block;
    margin-top: 4px;
    font-size: 13px;
    color: #94a3b8;
  }

  /* ── Quantity ── */
  .qty-box {
    display: inline-flex;
    align-items: center;
    background: #f1f5f9;
    border-radius: 12px;
    padding: 4px;
    gap: 2px;
  }

  .qty-box button {
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 9px;
    background: #fff;
    color: #0f172a;
    font-size: 18px;
    font-weight: 600;
    line-height: 1;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(15, 23, 42, 0.1);
    transition: background 0.2s, color 0.2s, transform 0.1s;
  }

  .qty-box button:hover:not(:disabled) { background: #2563eb; color: #fff; }
  .qty-box button:active:not(:disabled) { transform: scale(0.92); }
  .qty-box button:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

  .qty-box span {
    min-width: 34px;
    text-align: center;
    font-size: 15px;
    font-weight: 600;
    color: #0f172a;
  }

  /* ── Line total ── */
  .cp-price {
    min-width: 76px;
    text-align: right;
    font-family: 'Sora', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #0f172a;
  }

  /* ── Delete ── */
  .btn-delete {
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #fef2f2;
    color: #ef4444;
    border: 0;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, transform 0.15s;
  }

  .btn-delete:hover { background: #ef4444; color: #fff; transform: scale(1.06); }

  .cp-root button:focus-visible,
  .cp-link:focus-visible {
    outline: 3px solid rgba(147, 197, 253, 0.85);
    outline-offset: 2px;
  }

  /* ── Footer / total ── */
  .cp-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 20px 26px;
    background: linear-gradient(135deg, #f8fafc, #eff6ff);
    border-top: 1px solid #eef0f4;
  }

  .cp-foot-label {
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
  }

  .cp-foot-total {
    font-family: 'Sora', sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: #2563eb;
    letter-spacing: -0.5px;
  }

  /* ── Empty ── */
  .cp-empty {
    text-align: center;
    padding: 60px 24px 56px;
  }

  .cp-empty-icon {
    width: 84px;
    height: 84px;
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    background: #eff6ff;
    border-radius: 50%;
  }

  .cp-empty-title { font-size: 17px; font-weight: 600; color: #334155; margin: 0; }
  .cp-empty-sub { font-size: 14px; color: #94a3b8; margin: 6px 0 20px; }

  .cp-link {
    display: inline-block;
    padding: 12px 26px;
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    border-radius: 12px;
    box-shadow: 0 8px 22px rgba(37, 99, 235, 0.35);
    transition: transform 0.2s, filter 0.2s;
  }

  .cp-link:hover { transform: translateY(-2px); filter: brightness(1.08); }

  /* ── Responsive ── */
  @media (max-width: 720px) {
    .cp-head, .cp-foot { padding-left: 18px; padding-right: 18px; }

    .cp-item {
      grid-template-columns: 72px 1fr auto;
      grid-template-areas:
        "img info del"
        "img qty  price";
      gap: 10px 14px;
      padding: 16px 18px;
    }

    .cp-img { grid-area: img; width: 72px; height: 72px; }
    .cp-info { grid-area: info; }
    .qty-box { grid-area: qty; justify-self: start; }
    .cp-price { grid-area: price; min-width: 0; }
    .btn-delete { grid-area: del; width: 36px; height: 36px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .cp-item { animation: none; }
  }
`;

const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
);

const CartProducts = () => {
    const {
        products,
        removeFromCart,
        increaseQty,
        decreaseQty,
        total
    } = useShopContext();

    const itemsCount = products.reduce((n, p) => n + p.quantity, 0);

    return (
        <>
            <style>{styles}</style>

            <div className="cart-products cp-root">
                {/* Header */}
                <div className="cp-head">
                    <h2 className="cp-title">Cart Products</h2>
                    {products.length > 0 && (
                        <span className="cp-badge">
                            {itemsCount} {itemsCount === 1 ? "item" : "items"}
                        </span>
                    )}
                </div>

                {products.length === 0 ? (
                    <div className="cp-empty">
                        <div className="cp-empty-icon">🛒</div>
                        <p className="cp-empty-title">Your cart is empty! 🛒</p>
                        <p className="cp-empty-sub">
                            Looks like you haven't added anything yet.
                        </p>
                        <Link to="/home" className="cp-link">Browse menu</Link>
                    </div>
                ) : (
                    <>
                        <div className="cp-list">
                            {products.map((product, index) => (
                                <div
                                    className="cart-product cp-item"
                                    key={product._id}
                                    style={{ animationDelay: `${Math.min(index, 6) * 50}ms` }}
                                >
                                    <img
                                        className="cp-img"
                                        src={product.urlImage}
                                        alt={product.name}
                                    />

                                    <div className="cp-info">
                                        <span className="cp-name">{product.name}</span>
                                        <span className="cp-unit">
                                            ${Number(product.price).toFixed(2)} each
                                        </span>
                                    </div>

                                    <div className="qty-box">
                                        <button
                                            onClick={() => decreaseQty(product._id)}
                                            disabled={product.quantity <= 1}
                                            aria-label="Decrease quantity"
                                        >
                                            −
                                        </button>
                                        <span>{product.quantity}</span>
                                        <button
                                            onClick={() => increaseQty(product._id)}
                                            aria-label="Increase quantity"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <span className="cp-price">
                                        ${(product.price * product.quantity).toFixed(2)}
                                    </span>

                                    <button
                                        className="btn-delete"
                                        onClick={() => removeFromCart(product._id)}
                                        aria-label={`Remove ${product.name}`}
                                        title="Remove"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cp-foot">
                            <span className="cp-foot-label">Total price</span>
                            <span className="cp-foot-total">${Number(total).toFixed(2)}</span>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default CartProducts;