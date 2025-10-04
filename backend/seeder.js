const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/adminModel");
const Product = require("./models/productModel"); // ✅ check filename
const products = require("./data/products");

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    // 1. Seed Admin
    const adminExists = await Admin.findOne({ email: "admin@babli.com" });
    if (!adminExists) {
      const admin = await Admin.create({
        name: "Babli",
        email: "admin@babli.com",
        password: "admin123",
      });
      console.log("Default admin created:", admin);
    } else {
      console.log("Default admin already exists!");
    }

    // 2. Seed Products
    await Product.deleteMany(); // clear old products
    await Product.insertMany(products);
    console.log("Products seeded successfully!");

    process.exit();
  } catch (error) {
    console.error("Seeder error:", error);
    process.exit(1);
  }
};

seedData();
