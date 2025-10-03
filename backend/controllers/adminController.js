const Admin = require("../models/adminModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Address = require("../models/addressModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// JWT token
const generateToken = (admin) =>
  jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// -------------------------
// Admin login
// -------------------------
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (admin && await bcrypt.compare(password, admin.password)) {
      return res.json({
        message: "Login successful",
        token: generateToken(admin),
        admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      });
    }
    res.status(401).json({ message: "Invalid email or password" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// -------------------------
// Dashboard
// -------------------------
exports.getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const orders = await Order.find();
    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    res.json({
      message: "Welcome to Admin Dashboard",
      admin: req.admin.email,
      stats: { totalProducts, totalUsers, totalOrders, revenue },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error loading dashboard" });
  }
};

// -------------------------
// Product CRUD
// -------------------------
exports.addProduct = async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;
    const image = req.file ? req.file.filename : null;

    const product = new Product({ name, price, category, stock, image });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ message: "Failed to add product" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (req.file) updates.image = req.file.filename;

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.json(updatedProduct);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

// -------------------------
// Users
// -------------------------
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// -------------------------
// Orders
// -------------------------
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// -------------------------
// Addresses
// -------------------------
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find().populate("user", "name email");
    res.json(addresses);
  } catch (err) {
    console.error("Get addresses error:", err);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
};
