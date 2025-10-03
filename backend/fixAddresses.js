// fixAddresses.js
const mongoose = require("mongoose");
require("dotenv").config();

const Address = require("./models/addressModel");
const User = require("./models/userModel");

const MONGO_URI = process.env.MONGO_URL || "your_mongodb_uri_here";

const DEFAULT_USER_EMAIL = "admin@babli.com"; // or any user you want to assign

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB");

  try {
    const defaultUser = await User.findOne({ email: DEFAULT_USER_EMAIL });
    if (!defaultUser) {
      console.log(`Default user with email ${DEFAULT_USER_EMAIL} not found!`);
      process.exit(1);
    }

    const addressesToFix = await Address.find({ user: { $exists: false } });
    console.log(`Found ${addressesToFix.length} addresses without a user.`);

    for (const addr of addressesToFix) {
      addr.user = defaultUser._id;
      await addr.save();
      console.log(`Updated address ${addr._id}`);
    }

    console.log("All missing user addresses updated!");
  } catch (err) {
    console.error("Error fixing addresses:", err);
  } finally {
    mongoose.connection.close();
  }
});
