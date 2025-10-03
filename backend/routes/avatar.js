const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // correct path

router.post("/upload-avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");
  res.json({
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
});

module.exports = router;
