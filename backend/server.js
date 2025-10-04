/*
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const avatarRoutes = require("./routes/avatar");const addressRoutes = require("./routes/addressRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes"); // ⬅️ add this
const productRoutes = require("./routes/productRoutes");

const logger = require("./middleware/loggerMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use("/api/addresses", addressRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes); // ⬅️ add this
app.use("/api/products", productRoutes);
app.use("/images/products", express.static(path.join(__dirname, "images/products")));

// Error middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("❌ DB connection error:", err));
*/

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const avatarRoutes = require("./routes/avatar");
const addressRoutes = require("./routes/addressRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");

const logger = require("./middleware/loggerMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use("/api/addresses", addressRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/images/products", express.static(path.join(__dirname, "images/products")));

// Serve frontend
app.use(express.static(path.join(__dirname, "frontend")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Error middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB connection error:", err));
