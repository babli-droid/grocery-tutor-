const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // link to user
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
