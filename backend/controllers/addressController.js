const Address = require("../models/addressModel");

// -------------------------
// User functions (protected by user auth middleware)
// -------------------------

// Get all addresses for logged-in user
exports.getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new address for user
exports.addAddress = async (req, res) => {
  try {
    const newAddr = new Address({ ...req.body, user: req.user.id });
    await newAddr.save();
    res.status(201).json(newAddr);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update address (only if belongs to user)
exports.updateAddress = async (req, res) => {
  try {
    const updated = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Address not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete address (only if belongs to user)
exports.deleteAddress = async (req, res) => {
  try {
    const deleted = await Address.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Address not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// Admin functions (protected by admin middleware)
// -------------------------

// Get all addresses (admin)
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find().populate("user", "name email");
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single address by ID (admin)
exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id).populate("user", "name email");
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete address (admin)
exports.deleteAddressAdmin = async (req, res) => {
  try {
    const deleted = await Address.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Address not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
