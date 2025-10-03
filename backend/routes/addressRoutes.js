const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/protectAdmin");
const {
  getAllAddresses,
  getAddressById,
  deleteAddressAdmin,
} = require("../controllers/addressController");

// Get all addresses
router.get("/", protectAdmin, getAllAddresses);

// Get single address by ID
router.get("/:id", protectAdmin, getAddressById);

// Delete address by ID
router.delete("/:id", protectAdmin, deleteAddressAdmin);

module.exports = router;
