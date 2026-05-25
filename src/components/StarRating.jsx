import { useState } from "react";

const StarRating = ({ rating, onRate, readOnly = false }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: readOnly ? "14px" : "28px",
            color: (hovered || rating) >= star ? "#f59e0b" : "#ddd",
            cursor: readOnly ? "default" : "pointer",
            transition: "color 0.2s",
          }}
          onClick={() => !readOnly && onRate(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;