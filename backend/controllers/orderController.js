const Order = require("../models/orderModel");

// -------------------------
// User functions
// -------------------------

// Checkout - create a new order
exports.checkout = async (req, res) => {
  try {
    const { items, total, shippingInfo } = req.body;
    const userId = req.user.id; // from protect middleware

    if (!items || !total || !shippingInfo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const order = new Order({
      user: userId,
      items,
      total,
      shippingInfo
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get orders of logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json( orders );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// Admin functions
// -------------------------

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name email");
    res.status(200).json( orders );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single order by ID (admin)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const { status } = req.body;
    if (status) order.status = status;

    await order.save();
    res.status(200).json({ message: "Order updated", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
