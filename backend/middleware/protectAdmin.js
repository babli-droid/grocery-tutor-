const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

exports.protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin || admin.role !== "admin") return res.status(403).json({ message: "Access denied" });
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};
