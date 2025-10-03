const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // store image URL or path
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
