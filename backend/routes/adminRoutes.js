const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protectAdmin } = require("../middleware/protectAdmin");

const {
  loginAdmin,
  getDashboard,
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getUsers,
  getOrders,
  getAddresses
} = require("../controllers/adminController");

// Login
router.post("/login", loginAdmin);

// Dashboard
router.get("/dashboard", protectAdmin, getDashboard);

// Products
router.post("/products", protectAdmin, upload.single("image"), addProduct);
router.get("/products", protectAdmin, getProducts);
router.put("/products/:id", protectAdmin, upload.single("image"), updateProduct);
router.delete("/products/:id", protectAdmin, deleteProduct);

// Users
router.get("/users", protectAdmin, getUsers);

// Orders
router.get("/orders", protectAdmin, getOrders);

// Addresses
router.get("/addresses", protectAdmin, getAddresses);

module.exports = router;
