// listUsers.js
const mongoose = require("mongoose");
const User = require("./models/userModel");
require("dotenv").config();

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    const users = await User.find({});
    console.log("Users:", users);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error:", err);
  }
}

listUsers();
