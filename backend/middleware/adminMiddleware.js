const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    // ✅ TOKEN HUBI
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ msg: "No token, access denied" });
    }

    // ✅ TOKEN VERIFY
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // ✅ ADMIN HUBI
    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied - Admins only!" });
    }

    req.user = user;
    next();

  } catch (err) {
    res.status(401).json({ msg: "Token invalid" });
  }
};