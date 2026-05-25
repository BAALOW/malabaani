const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  avatar: {
    type: String,
    default: "https://i.imgur.com/HeIi0wU.png"
  },
  address: String,
  favorites: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
  ],

  // ✅ ROLE CUSUB KU DARAY
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }

}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);