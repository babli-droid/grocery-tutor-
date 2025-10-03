const mongoose = require("mongoose");
const Order = require("./models/orderModel");
const User = require("./models/userModel"); // <-- Add this
require("dotenv").config();

async function listOrders() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    const orders = await Order.find({}).populate("user", "name email"); // now populate works
    console.log("Orders:", JSON.stringify(orders, null, 2));

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error:", err);
  }
}

listOrders();
