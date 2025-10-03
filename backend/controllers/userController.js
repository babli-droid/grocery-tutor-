// backend/controllers/userController.js
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// -------------------------
// REGISTER USER
// -------------------------
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists  
    const existingUser = await User.findOne({ email });  
    if (existingUser) return res.status(400).json({ message: "User already exists" });  

    // Hash password  
    const hashedPassword = await bcrypt.hash(password, 10);  

    // Create new user  
    const newUser = await User.create({ name, email, password: hashedPassword });  

    // Generate JWT  
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });  

    res.status(201).json({  
      message: "User registered successfully",  
      user: { id: newUser._id, name: newUser.name, email: newUser.email },  
      token,  
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// LOGIN USER
// -------------------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists  
    const user = await User.findOne({ email });  
    if (!user) return res.status(400).json({ message: "Invalid credentials" });  

    // Validate password  
    const isMatch = await bcrypt.compare(password, user.password);  
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });  

    // Generate JWT  
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });  

    res.status(200).json({  
      message: "Login successful",  
      user: { id: user._id, name: user.name, email: user.email },  
      token,  
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// ADMIN FUNCTIONS
// -------------------------

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// EXPORT ALL FUNCTIONS
// -------------------------
module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUser,
};
