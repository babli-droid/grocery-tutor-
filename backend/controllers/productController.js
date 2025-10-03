const Product = require("../models/Product");

// -------------------------
// Get all products
// -------------------------
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// -------------------------
// Get single product by ID
// -------------------------
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// -------------------------
// Add a new product
// -------------------------
exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, image, stock } = req.body;

    const newProduct = new Product({
      name,
      price,
      description,
      image,
      stock,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
};

// -------------------------
// Update product by ID
// -------------------------
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, image, stock } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, image, stock },
      { new: true } // return the updated document
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
};

// -------------------------
// Delete product
// -------------------------
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
