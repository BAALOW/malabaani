const User = require("../models/User");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Product = require("../models/Product"); // ✅ CUSUB

// ✅ GET STATISTICS
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalOrders = await Order.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalProducts = await Product.countDocuments(); // ✅ CUSUB

    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2),
      totalReviews,
      totalProducts // ✅ CUSUB
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ GET ALL ORDERS
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ GET ALL REVIEWS
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ DELETE REVIEW
exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ msg: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ GET ALL PRODUCTS - CUSUB
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ ADD PRODUCT - CUSUB
exports.addProduct = async (req, res) => {
  try {
    const { name, urlImage, price, category } = req.body;
    if (!name || !urlImage || !price || !category) {
      return res.status(400).json({ msg: "All fields required" });
    }
    const product = await Product.create({ name, urlImage, price, category });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ UPDATE PRODUCT - CUSUB
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ DELETE PRODUCT - CUSUB
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};