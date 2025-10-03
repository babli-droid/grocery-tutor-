const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  image: { type: String }, // will store the image path from multer
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
