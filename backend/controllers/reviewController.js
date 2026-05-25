const Review = require("../models/Review");

// ADD REVIEW
exports.addReview = async (req, res) => {
  try {
    const { foodName, foodImage, rating, comment } = req.body;

    const review = new Review({
      user: req.user.id,
      foodName,
      foodImage,
      rating,
      comment
    });

    await review.save();

    res.status(201).json({ msg: "Review added successfully", review });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET REVIEWS BY FOOD NAME
exports.getReviewsByFood = async (req, res) => {
  try {
    const { foodName } = req.params;

    const reviews = await Review.find({ foodName })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

    res.json({
      reviews,
      avgRating: avgRating.toFixed(1),
      totalReviews: reviews.length
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET MY REVIEWS
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(reviews);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};