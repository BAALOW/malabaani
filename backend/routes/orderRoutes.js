const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { placeOrder, getMyOrders } = require("../controllers/orderController");

router.post("/place", auth, placeOrder);
router.get("/myorders", auth, getMyOrders);

module.exports = router;