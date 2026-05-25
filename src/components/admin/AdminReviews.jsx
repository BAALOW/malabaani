import "../../styles/admin.css";

const AdminReviews = ({ reviews, onDeleteReview }) => {
  return (
    <>
      <h2 className="admin-page-title">⭐ All Reviews ({reviews.length})</h2>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Food</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  <div className="admin-user-row">
                    <div className="admin-u-avatar">
                      {review.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    {review.user?.name || "User"}
                  </div>
                </td>
                <td><strong>{review.foodName}</strong></td>
                <td>
                  <span style={{ color: "#f59e0b", fontSize: "14px" }}>
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </span>
                </td>
                <td>
                  <p style={{ margin: 0, fontSize: "12px", color: "#555", fontStyle: "italic" }}>
                    "{review.comment}"
                  </p>
                </td>
                <td>
                  <button className="admin-delete-btn" onClick={() => onDeleteReview(review._id)}>
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminReviews;