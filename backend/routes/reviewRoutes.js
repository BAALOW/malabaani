const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  addReview,
  getReviewsByFood,
  getMyReviews
} = require("../controllers/reviewController");

// ADD REVIEW
router.post("/add", auth, addReview);

// GET REVIEWS BY FOOD
router.get("/food/:foodName", getReviewsByFood);

// GET MY REVIEWS
router.get("/myreviews", auth, getMyReviews);

module.exports = router;