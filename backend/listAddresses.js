const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const User = require("./models/userModel");      // <--- Add this
const Address = require("./models/addressModel");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

// List addresses
const listAddresses = async () => {
  try {
    const addresses = await Address.find().populate("user", "name email");
    console.log(addresses);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

listAddresses();
