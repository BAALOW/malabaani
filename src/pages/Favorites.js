import { useEffect, useState } from "react";
import API from "../api";
import useShopContext from "../ShopContext";
import { FaHeart } from "react-icons/fa";

const Favorites = () => {
  const { addToCart, removeFromCart, products: cartProducts } = useShopContext();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH FAVORITES
  const fetchFavorites = async () => {
    try {
      const res = await API.get("/favorites/my-favorites");
      setFavorites(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // ✅ REMOVE FROM FAVORITES - REALTIME
  const handleRemoveFavorite = async (productName) => {
    try {
      await API.post("/favorites/toggle", { productName });
      setFavorites(prev => prev.filter(f => f.productName !== productName));
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ CHECK IF IN CART
  const isInCart = (productName) => {
    return cartProducts.some(p => p.name === productName);
  };

  // ✅ HANDLE ADD TO CART
  const handleAddToCart = (fav) => {
    const product = {
      _id: fav._id,
      name: fav.productName,
      urlImage: fav.urlImage,
      price: fav.price,
      category: fav.category,
    };
    if (isInCart(fav.productName)) {
      removeFromCart(fav._id);
    } else {
      addToCart(product);
    }
  };

  if (loading) return (
    <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>
  );

  return (
    <div style={styles.page}>

      {/* TITLE */}
      <h2 style={styles.title}>
        <FaHeart color="#e74c3c" /> My Favorites
      </h2>

      {/* EMPTY */}
      {favorites.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyIcon}>❤️</p>
          <p style={styles.emptyText}>No favorites yet!</p>
          <p style={styles.emptySubText}>Gujio wadnaha si aad ugu darsato</p>
        </div>
      ) : (
        <div style={styles.favCard}>
          {favorites.map((fav, index) => (
            <div key={index} style={{
              ...styles.itemRow,
              borderBottom: index === favorites.length - 1 ? "none" : "1px solid #f0f0f0"
            }}>

              {/* IMAGE */}
              <img
                src={fav.urlImage || "https://via.placeholder.com/50"}
                alt={fav.productName}
                style={styles.itemImage}
              />

              {/* NAME + PRICE */}
              <div style={styles.itemInfo}>
                <span style={styles.itemName}>{fav.productName}</span>
                <span style={styles.itemPrice}>
                  ${fav.price ? fav.price.toFixed(2) : "0.00"}
                </span>
              </div>

              {/* ADD TO CART BUTTON */}
              <button
                style={{
                  ...styles.cartBtn,
                  background: isInCart(fav.productName) ? "#e74c3c" : "#1a73e8",
                }}
                onClick={() => handleAddToCart(fav)}
              >
                {isInCart(fav.productName) ? "Remove" : "Add to Cart"}
              </button>

              {/* HEART BUTTON - REMOVE FROM FAVORITES */}
              <button
                style={styles.heartBtn}
                onClick={() => handleRemoveFavorite(fav.productName)}
              >
                ♥
              </button>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

const styles = {
  page: {
    maxWidth: "650px",
    margin: "30px auto",
    padding: "0 20px",
    fontFamily: "sans-serif"
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#222",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  emptyBox: {
    textAlign: "center",
    padding: "60px 20px",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 2px 15px rgba(0,0,0,0.08)"
  },
  emptyIcon: {
    fontSize: "50px",
    margin: "0 0 10px 0"
  },
  emptyText: {
    fontSize: "18px",
    color: "#333",
    fontWeight: "bold",
    margin: "0 0 6px 0"
  },
  emptySubText: {
    fontSize: "14px",
    color: "#888",
    margin: 0
  },
  favCard: {
    background: "white",
    borderRadius: "16px",
    padding: "10px 20px",
    boxShadow: "0 2px 15px rgba(0,0,0,0.08)"
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 0",
  },
  itemImage: {
    width: "55px",
    height: "55px",
    borderRadius: "12px",
    objectFit: "cover",
    flexShrink: 0
  },
  itemInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  itemName: {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#333",
    textTransform: "capitalize"
  },
  itemPrice: {
    fontSize: "14px",
    color: "#1a73e8",
    fontWeight: "bold"
  },
  cartBtn: {
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap"
  },
  heartBtn: {
    background: "#ffe5e5",
    color: "#e74c3c",
    border: "none",
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s"
  }
};

export default Favorites;