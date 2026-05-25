const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getStats,
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getAllReviews,
  deleteReview,
  // ✅ ADD THESE
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/adminController");

// ✅ STATS
router.get("/stats", adminMiddleware, getStats);

// ✅ USERS
router.get("/users", adminMiddleware, getAllUsers);
router.delete("/users/:id", adminMiddleware, deleteUser);

// ✅ ORDERS
router.get("/orders", adminMiddleware, getAllOrders);
router.put("/orders/:id", adminMiddleware, updateOrderStatus);

// ✅ REVIEWS
router.get("/reviews", adminMiddleware, getAllReviews);
router.delete("/reviews/:id", adminMiddleware, deleteReview);

// ✅ PRODUCTS - CUSUB KU DAR
router.get("/products", adminMiddleware, getAllProducts);
router.post("/products", adminMiddleware, addProduct);
router.put("/products/:id", adminMiddleware, updateProduct);
router.delete("/products/:id", adminMiddleware, deleteProduct);

module.exports = router;