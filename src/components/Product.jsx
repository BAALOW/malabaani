import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useShopContext from "../ShopContext";
import API from "../api";

const Product = ({ product }) => {

    const navigate = useNavigate();
    const { addToCart, removeFromCart, products } = useShopContext();
    const [IsInCart, setIsInCart] = useState(false);
    const [rating, setRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [showReviews, setShowReviews] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [heartPop, setHeartPop] = useState(false);

    const goToDetails = () => navigate(`/product/${product._id}`);

    // ✅ CHECK CART
    useEffect(() => {
        const isincart = products.filter(pro => pro._id === product._id);
        setIsInCart(isincart.length > 0);
    }, [products]);

    // ✅ FETCH RATING
    useEffect(() => {
        const fetchRating = async () => {
            try {
                const res = await API.get(`/reviews/food/${product.name}`);
                setRating(res.data.avgRating);
                setTotalReviews(res.data.totalReviews);
                setReviews(res.data.reviews);
            } catch (err) {
                console.log(err);
            }
        };
        fetchRating();
    }, [product.name]);

    // ✅ CHECK FAVORITE
    useEffect(() => {
        const checkFavorite = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const res = await API.get("/favorites/my-favorites");
                const found = res.data.find(f => f.productName === product.name);
                setIsFavorite(!!found);
            } catch (err) {
                console.log(err);
            }
        };
        checkFavorite();
    }, [product.name]);

    const handleAddTocart = () => {
        if (IsInCart) {
            removeFromCart(product._id);
        } else {
            addToCart(product);
        }
    };

    const handleFavorite = async (e) => {
        e.stopPropagation();
        // trigger pop animation
        setHeartPop(true);
        setTimeout(() => setHeartPop(false), 350);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login to add favorites!");
                return;
            }
            const res = await API.post("/favorites/toggle", { productName: product.name });
            setIsFavorite(res.data.isFavorite);
        } catch (err) {
            console.log(err);
        }
    };

    const renderStars = (avg) => {
        const full = Math.floor(avg);
        const half = avg - full >= 0.5;
        const empty = 5 - full - (half ? 1 : 0);
        return (
            <>
                {"★".repeat(full)}
                {half ? "½" : ""}
                {"☆".repeat(empty)}
            </>
        );
    };

    return (
        <>
            {/* ── CARD ── */}
            <div
                style={styles.card}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.05)";
                    e.currentTarget.querySelector(".card-img").style.transform = "scale(1.06)";
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 14px rgba(0,0,0,0.06)";
                    e.currentTarget.querySelector(".card-img").style.transform = "scale(1)";
                }}
            >

                {/* Image (click → Product Details) */}
                <div style={styles.imgWrap} onClick={goToDetails}>
                    <img
                        className="card-img"
                        src={product.urlImage}
                        alt={product.name}
                        style={styles.img}
                    />

                    {/* ❤️ Favorite Heart Button */}
                    <button
                        style={{
                            ...styles.heartBtn,
                            background: isFavorite ? "#e74c3c" : "rgba(255,255,255,0.92)",
                            boxShadow: isFavorite
                                ? "0 4px 16px rgba(231,76,60,0.45)"
                                : "0 2px 10px rgba(0,0,0,0.12)",
                            transform: heartPop ? "scale(1.35)" : isFavorite ? "scale(1.08)" : "scale(1)",
                        }}
                        onClick={handleFavorite}
                    >
                        <span style={{
                            color: isFavorite ? "white" : "#e74c3c",
                            fontSize: "17px",
                            lineHeight: 1,
                            display: "block",
                        }}>
                            {isFavorite ? "♥" : "♡"}
                        </span>
                    </button>
                </div>

                {/* Body */}
                <div style={styles.body}>

                    {/* Title (click → Product Details) */}
                    <p style={styles.title} onClick={goToDetails}>
                        {product.name}
                    </p>

                    {/* Stars + Price row */}
                    <div style={styles.metaRow}>
                        {totalReviews > 0 ? (
                            <div
                                style={{ ...styles.starsRow, cursor: "pointer" }}
                                onClick={() => setShowReviews(true)}
                            >
                                <span style={styles.stars}>{renderStars(parseFloat(rating))}</span>
                                <span style={styles.ratingScore}>{rating}</span>
                                <span style={styles.reviewCount}>({totalReviews})</span>
                            </div>
                        ) : (
                            <div style={styles.starsRow}>
                                <span style={styles.noReview}>No reviews yet</span>
                            </div>
                        )}
                        <span style={styles.price}>${product.price.toFixed(2)}</span>
                    </div>

                    {/* Add to Cart button */}
                    <button
                        style={{
                            ...styles.cartBtn,
                            background: IsInCart ? "#e74c3c" : "#2563eb",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.background = IsInCart ? "#c0392b" : "#1d4ed8";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.background = IsInCart ? "#e74c3c" : "#2563eb";
                        }}
                        onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
                        onMouseUp={e => e.currentTarget.style.transform = "translateY(-1px)"}
                        onClick={handleAddTocart}
                    >
                        🛒 {IsInCart ? "Remove" : "Add to Cart"}
                    </button>
                </div>
            </div>

            {/* ── REVIEWS MODAL ── */}
            {showReviews && (
                <div style={styles.overlay} onClick={() => setShowReviews(false)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <img src={product.urlImage} alt="" style={styles.modalImg} />
                            <div>
                                <p style={styles.modalTitle}>{product.name}</p>
                                <div style={styles.modalStars}>
                                    <span style={styles.modalStarText}>{renderStars(parseFloat(rating))}</span>
                                    <span style={styles.modalRating}>{rating} ({totalReviews} reviews)</span>
                                </div>
                            </div>
                            <button style={styles.closeBtn} onClick={() => setShowReviews(false)}>✕</button>
                        </div>
                        <div style={styles.divider} />
                        <div style={styles.reviewsList}>
                            {reviews.length === 0 ? (
                                <p style={styles.noReviewText}>No reviews yet!</p>
                            ) : (
                                reviews.map((review, index) => (
                                    <div key={index} style={styles.reviewCard}>
                                        <div style={styles.reviewHeader}>
                                            <div style={styles.userAvatar}>
                                                {review.user?.name?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                            <div>
                                                <p style={styles.userName}>{review.user?.name || "User"}</p>
                                                <p style={styles.reviewDate}>
                                                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                                                        year: "numeric", month: "short", day: "numeric"
                                                    })}
                                                </p>
                                            </div>
                                            <span style={styles.reviewStars}>
                                                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                            </span>
                                        </div>
                                        <p style={styles.reviewComment}>"{review.comment}"</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const styles = {

    /* ── CARD ── */
    card: {
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 2px 14px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease",
        cursor: "pointer",
    },

    /* ── IMAGE ── */
    imgWrap: {
        width: "100%",
        height: "250px",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
        cursor: "pointer",
    },
    img: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
    },

    /* ── HEART BUTTON ── */
    heartBtn: {
        position: "absolute",
        top: "10px",
        right: "10px",
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.25s ease, box-shadow 0.25s ease",
    },

    /* ── BODY ── */
    body: {
        padding: "13px 14px 15px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        gap: "0px",
    },
    title: {
        margin: "0 0 10px",
        fontSize: "15px",
        fontWeight: "700",
        color: "#111",
        lineHeight: "1.2",
        textTransform: "capitalize",
        cursor: "pointer",
    },

    /* ── META ROW (stars + price) ── */
    metaRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "10px",
    },
    starsRow: {
        display: "flex",
        alignItems: "center",
        gap: "3px",
    },
    stars: {
        color: "#f59e0b",
        fontSize: "12px",
        letterSpacing: "1px",
    },
    ratingScore: {
        fontSize: "12px",
        fontWeight: "600",
        color: "#333",
        marginLeft: "2px",
    },
    reviewCount: {
        fontSize: "11px",
        color: "#bbb",
    },
    noReview: {
        fontSize: "11px",
        color: "#bbb",
    },
    price: {
        fontSize: "15px",
        fontWeight: "800",
        color: "#111",
        letterSpacing: "-0.3px",
    },

    /* ── ADD TO CART BUTTON ── */
    cartBtn: {
        width: "100%",
        padding: "10px 0",
        color: "#fff",
        fontSize: "13px",
        fontWeight: "700",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "7px",
        marginTop: "auto",
        transition: "background 0.2s, transform 0.15s cubic-bezier(0.34,1.56,0.64,1)",
    },

    /* ── MODAL ── */
    overlay: {
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 99999,
    },
    modal: {
        background: "white", borderRadius: "20px",
        padding: "24px", width: "380px",
        maxHeight: "80vh", overflowY: "auto",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    },
    modalHeader: {
        display: "flex", alignItems: "center",
        gap: "12px", marginBottom: "16px",
    },
    modalImg: {
        width: "55px", height: "55px",
        borderRadius: "12px", objectFit: "cover",
    },
    modalTitle: {
        margin: 0, fontWeight: "bold",
        fontSize: "17px", color: "#222",
        textTransform: "capitalize",
    },
    modalStars: {
        display: "flex", alignItems: "center",
        gap: "6px", marginTop: "4px",
    },
    modalStarText: { color: "#f59e0b", fontSize: "14px" },
    modalRating: { fontSize: "12px", color: "#888" },
    closeBtn: {
        marginLeft: "auto", background: "#f5f5f5",
        border: "none", borderRadius: "50%",
        width: "32px", height: "32px",
        cursor: "pointer", fontSize: "14px",
        color: "#555", display: "flex",
        alignItems: "center", justifyContent: "center",
    },
    divider: { height: "1px", background: "#f0f0f0", marginBottom: "16px" },
    reviewsList: { display: "flex", flexDirection: "column", gap: "12px" },
    reviewCard: {
        background: "#fafafa", borderRadius: "12px",
        padding: "14px", border: "1px solid #f0f0f0",
    },
    reviewHeader: {
        display: "flex", alignItems: "center",
        gap: "10px", marginBottom: "8px",
    },
    userAvatar: {
        width: "36px", height: "36px",
        borderRadius: "50%", background: "#2563eb",
        color: "white", fontSize: "14px",
        fontWeight: "bold", display: "flex",
        alignItems: "center", justifyContent: "center",
        flexShrink: 0,
    },
    userName: { margin: 0, fontWeight: "bold", fontSize: "14px", color: "#333" },
    reviewDate: { margin: 0, fontSize: "11px", color: "#aaa" },
    reviewStars: { marginLeft: "auto", color: "#f59e0b", fontSize: "13px" },
    reviewComment: {
        margin: 0, fontSize: "13px",
        color: "#555", fontStyle: "italic", lineHeight: "1.5",
    },
    noReviewText: { textAlign: "center", color: "#888", fontSize: "14px" },
};

export default Product;