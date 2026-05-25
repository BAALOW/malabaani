import { useState, useEffect } from "react";
import API from "../api";
import StarRating from "./StarRating";
import { useNotification } from "../context/NotificationContext";

const ReviewModal = ({ food, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false); // ✅ ADDED
  const [checkingReview, setCheckingReview] = useState(true);   // ✅ ADDED
  const { showNotification } = useNotification();

  // ✅ HUBI HADA USER KA REVIEW HORE U SAMAAYAY
  useEffect(() => {
    const checkExistingReview = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/reviews/myreviews", {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Food kastaa review hore u samaayay miyaan?
        const found = res.data.find(
          (r) => r.foodName.toLowerCase() === food.name.toLowerCase()
        );

        if (found) {
          setAlreadyReviewed(true);
          setRating(found.rating);
          setComment(found.comment);
        }

      } catch (err) {
        console.log(err);
      }
      setCheckingReview(false);
    };

    checkExistingReview();
  }, [food.name]);

  const handleSubmit = async () => {
    if (rating === 0) {
      showNotification("Please select a rating! ⭐", "error");
      return;
    }
    if (comment.trim() === "") {
      showNotification("Please write a comment! ✍️", "error");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      await API.post("/reviews/add", {
        foodName: food.name,
        foodImage: food.urlImage,
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showNotification("Review submitted successfully! ⭐", "success");
      onSuccess();
      onClose();

    } catch (err) {
      showNotification("Review failed! Try again ❌", "error");
    }
    setLoading(false);
  };

  // ✅ LOADING CHECK
  if (checkingReview) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <p style={{ textAlign: "center", color: "#888" }}>Checking... ⏳</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {/* HEADER */}
        <div style={styles.header}>
          <img src={food.urlImage} alt="" style={styles.foodImg} />
          <div>
            <p style={styles.foodName}>Review: {food.name}</p>
            <p style={styles.foodSubtitle}>
              {alreadyReviewed
                ? "You already reviewed this food! ✅"
                : "How was your experience?"
              }
            </p>
          </div>
        </div>

        {/* ✅ HADI HORE U REVIEW GAREEAY - MUUJI KALIYA */}
        {alreadyReviewed ? (
          <>
            <div style={styles.alreadyBox}>
              <p style={styles.alreadyTitle}>Your Review</p>

              {/* STARS */}
              <div style={styles.starsRow}>
                <StarRating rating={rating} readOnly={true} />
                <span style={styles.ratingText}>
                  {rating === 1 && "Bad 😞"}
                  {rating === 2 && "Not good 😐"}
                  {rating === 3 && "OK 🙂"}
                  {rating === 4 && "Good 😊"}
                  {rating === 5 && "Excellent! 🔥"}
                </span>
              </div>

              {/* COMMENT */}
              <p style={styles.existingComment}>"{comment}"</p>
            </div>

            {/* CLOSE BUTTON KALIYA */}
            <button style={styles.closeBtnFull} onClick={onClose}>
              Close
            </button>
          </>
        ) : (
          <>
            {/* STARS */}
            <div style={styles.starsRow}>
              <StarRating rating={rating} onRate={setRating} />
              <span style={styles.ratingText}>
                {rating === 1 && "Bad 😞"}
                {rating === 2 && "Not good 😐"}
                {rating === 3 && "OK 🙂"}
                {rating === 4 && "Good 😊"}
                {rating === 5 && "Excellent! 🔥"}
              </span>
            </div>

            {/* COMMENT */}
            <textarea
              style={styles.textarea}
              placeholder="Write your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />

            {/* BUTTONS */}
            <div style={styles.buttons}>
              <button style={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button
                style={styles.submitBtn}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit ⭐"}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
  },
  modal: {
    background: "white",
    borderRadius: "20px",
    padding: "24px",
    width: "340px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  foodImg: {
    width: "55px",
    height: "55px",
    borderRadius: "12px",
    objectFit: "cover",
  },
  foodName: {
    margin: 0,
    fontWeight: "bold",
    fontSize: "16px",
    color: "#222",
  },
  foodSubtitle: {
    margin: 0,
    fontSize: "12px",
    color: "#888",
  },
  alreadyBox: {
    background: "#f0f4ff",
    borderRadius: "12px",
    padding: "14px",
    marginBottom: "16px",
  },
  alreadyTitle: {
    margin: "0 0 8px 0",
    fontWeight: "bold",
    fontSize: "14px",
    color: "#1a73e8",
  },
  existingComment: {
    margin: "8px 0 0 0",
    fontSize: "13px",
    color: "#555",
    fontStyle: "italic",
  },
  starsRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    justifyContent: "center",
  },
  ratingText: {
    fontSize: "14px",
    color: "#555",
    fontWeight: "500",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    border: "2px solid #f0f0f0",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#333",
    resize: "none",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "sans-serif",
    marginBottom: "16px",
  },
  buttons: {
    display: "flex",
    gap: "10px",
  },
  cancelBtn: {
    flex: 1,
    padding: "10px",
    background: "#f5f5f5",
    color: "#666",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
  submitBtn: {
    flex: 1,
    padding: "10px",
    background: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
  closeBtnFull: {
    width: "100%",
    padding: "10px",
    background: "#f5f5f5",
    color: "#666",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
};

export default ReviewModal;