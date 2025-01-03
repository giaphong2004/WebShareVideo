const express = require("express");
const router = express.Router();


// API để lấy danh sách người dùng
router.get("/user", (req, res) => {
  const query = "SELECT * FROM user"; // Lấy danh sách người dùng
  connection.query(query, (err, results) => {
    if (err) {
      // Lỗi server
      return res.status(500).json({ error: "Failed to fetch users" });
    }
    res.json(results);
  });
});

module.exports = router;
