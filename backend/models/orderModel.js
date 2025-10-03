const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  shippingInfo: {
    fullname: String,
    phone: String,
    address: String,
    city: String,
    zipcode: String,
    paymentMethod: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
