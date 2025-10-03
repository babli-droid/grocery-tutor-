const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const Product = require("../models/Product"); // make sure this path is correct

// GET all products
router.get("/", getProducts);

// GET single product by id
router.get("/:id", getProductById);

// POST add product
router.post("/", addProduct);

// PUT update product by id
router.put("/:id", updateProduct);

// DELETE product by id
router.delete("/:id", deleteProduct);

// 🔍 SEARCH products by name
router.get("/search/query", async (req, res) => {
  try {
    const q = req.query.q || "";
    const products = await Product.find({
      name: { $regex: q, $options: "i" }, // case-insensitive
    });
    res.json(products);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
