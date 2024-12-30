const express = require("express");
const bodyParser = require("body-parser"); // npm install body-parser
const cors = require("cors"); // npm install cors
const db = require("./connect"); // đường dẫn đến file connect.js
const app = express();
app.use(bodyParser.json()); // parse application/json
app.use(cors()); 


// Thêm người dùng
app.post("/user", (req, res) => {
  const { name, email } = req.body;
  const sql = "INSERT INTO user (user_id, fname_user, image_url) VALUES (?, ?)"; // user là tên bảng
  db.query(sql, [name, email], (err, result) => { // thêm dữ liệu vào bảng
    if (err) throw err; // nếu có lỗi thì in ra lỗi
    res.send("User added successfully!"); // nếu không có lỗi thì in ra thông báo
  });
});
// Lấy danh sách người dùng
app.get("/user", (req, res) => { // lấy dữ liệu từ bảng user
  const sql = "SELECT * FROM user"; // lấy tất cả dữ liệu từ bảng user
  db.query(sql, (err, results) => { // truy vấn dữ liệu
    if (err) throw err;
    res.json(results); // trả về dữ liệu dạng JSON
  });
});
// Cập nhật người dùng
app.put("/user/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const sql = "UPDATE user SET fname_user = ? WHERE user_id = ?"; // cập nhật dữ liệu trong bảng user theo id của user
  db.query(sql, [name, email, id], (err, result) => {
    if (err) throw err;
    res.send("User updated successfully!");
  });
});
// Xóa người dùng
app.delete("/user/:user_id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM user WHERE user_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send("User deleted successfully!");
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
