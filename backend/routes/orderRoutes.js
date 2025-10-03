const express = require("express");
const router = express.Router();
const { checkout, getUserOrders } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware"); // JWT middleware

router.post("/checkout", protect, checkout);
router.get("/myorders", protect, getUserOrders);

module.exports = router;
