const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const path = require("path");
const cors = require("cors"); // Import cors
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "streamhub_sql",
});

connection.connect(function (err) {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Connected to the database as id " + connection.threadId);
});

const app = express();

app.use(cors()); // Use cors middleware

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
  if (req.session.loggedin) {
    next(); // allow the next route to run
  } else {
    // require the user to log in
    res.send("Please login to view this page!");
  }
}

// http://localhost:3000/auth
app.post("/auth", function (request, response) {
  let username = request.body.username;
  let password = request.body.password;
  if (username && password) {
    connection.query(
      "SELECT * FROM user WHERE user_uname = ? AND password = ?",
      [username, password],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          request.session.loggedin = true;
          request.session.username = username;
          response.json({ success: true });
        } else {
          response.status(400).json({
            success: false,
            message: "Incorrect Username and/or Password!",
          });
        }
        response.end();
      }
    );
  } else {
    response
      .status(400)
      .json({ success: false, message: "Please enter Username and Password!" });
    response.end();
  }
});

// http://localhost:3000/auth/register
app.post("/auth/register", function (request, response) {
  let username = request.body.username;
  let password = request.body.password;
  let email = request.body.email;
  if (username && password && email) {
    connection.query(
      "SELECT * FROM user WHERE user_uname = ?",
      [username],
      function (error, results, fields) {
        if (error) {
          response
            .status(500)
            .json({ success: false, message: "Database query error" });
          return;
        }
        if (results.length > 0) {
          response
            .status(400)
            .json({ success: false, message: "Username already exists" });
        } else {
          connection.query(
            "INSERT INTO user (user_uname, password, email) VALUES (?, ?, ?)",
            [username, password, email],
            function (error, results) {
              if (error) {
                response
                  .status(500)
                  .json({ success: false, message: "Database insert error" });
                return;
              }
              response
                .status(200)
                .json({ success: true, message: "Registration successful" });
            }
          );
        }
      }
    );
  } else {
    response
      .status(400)
      .json({ success: false, message: "Please enter all required fields" });
  }
});

// http://localhost:3000/home
app.get("/home", requireLogin, function (request, response) {
  response.send("Welcome back, " + request.session.username + "!");
  response.end();
});

// http://localhost:3000/logout
app.get("/logout", function (request, response) {
  request.session.destroy((err) => {
    if (err) {
      return response
        .status(500)
        .json({ success: false, message: "Failed to logout." });
    }
    response.json({ success: true, message: "Logout successful" });
  });
});

// API để lấy danh sách người dùng
app.get("/api/user", (req, res) => {
  const query = "SELECT * FROM user";
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch users" });
    }
    res.json(results);
  });
});
// API lấy thông tin người dùng theo id
app.get("/api/user/:user_id", (req, res) => {
  const { user_id } = req.params;
  const query = "SELECT * FROM user WHERE user_id = ?";
  connection.query(query, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch user" });
    }
    res.json(results);
  });
});


// Cập nhật người dùng
app.put("/api/user/:user_id", (req, res) => {
  const { user_id } = req.params;
  const { user_uname, email } = req.body;
  const sql = "UPDATE user SET user_uname = ?, email = ? WHERE user_id = ?";
  connection.query(sql, [user_uname, email, user_id], (err, result) => {
    if (err) throw err;
    res.send("Cập nhật thông tin thành công!");
  });
});
// Xóa người dùng
app.delete("/api/user/:user_id", (req, res) => {
  const { user_id } = req.params;
  const sql = "DELETE FROM user WHERE user_id = ?";
  connection.query(sql, [user_id], (err, result) => {
    if (err) throw err;
    res.send("Đã xoá");
  });
});

// API để lấy danh sách video kèm theo thông tin category
app.get("/api/video", (req, res) => {
  const query = `
    SELECT v.video_id, v.title, v.url_video, v.cover_url, v.detail, c.category
    FROM video v
    INNER JOIN category c ON c.id = v.cate_id
  `;
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch videos" });
    }
    res.json(results);
  });
});
// 
// API để thêm video
app.post("/api/video", (req, res) => {
  const { title, url_video, cover_url, detail, cate_id } = req.body;
  const query =
    "INSERT INTO video (title, url_video, cover_url, detail, cate_id) VALUES (?, ?, ?, ?, ?)";
  connection.query(
    query,
    [title, url_video, cover_url, detail, cate_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Thêm thất bại" });
      }
      res.json({ success: true, message: "Thêm thành công!" });
    }
  );
});
// Cập nhật video
app.put("/api/video/:video_id", (req, res) => {
  const { video_id } = req.params;
  const { title, url_video, cover_url, detail, cate_id } = req.body;
  const sql = "UPDATE video SET title = ?, url_video = ?, cover_url = ?, detail = ?, cate_id = ? WHERE video_id = ?";
  connection.query(sql, [title, url_video, cover_url, detail, cate_id, video_id], (err, result) => {
    if (err) throw err;
    res.send("Cập nhật thông tin thành công!");
  });
});
// Xóa video
app.delete("/api/video/:video_id", (req, res) => {
  const { video_id } = req.params;
  const sql = "DELETE FROM video WHERE video_id = ?";
  connection.query(sql, [video_id], (err, result) => {
    if (err) throw err;
    res.send("Đã xoá");
  });
});




// API lấy thông tin video theo id kèm theo thông tin category
app.get("/api/video/:video_id", (req, res) => {
  const { video_id } = req.params;
  const query = `
    SELECT v.video_id, v.title, v.url_video, v.cover_url, v.detail, c.category
    FROM video v
    INNER JOIN category c ON c.id = v.cate_id
    WHERE v.video_id = ?
  `;
  connection.query(query, [video_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch video" });
    }
    if (results.length > 0) {
      res.json(results[0]); // Trả về kết quả đầu tiên
    } else {
      res.status(404).json({ error: "Video not found" });
    }
  });
});

// API để lấy danh sách video theo category
app.get("/api/video/category/:category_id", (req, res) => {
  const { category_id } = req.params;
  const query = `
    SELECT v.video_id, v.title, v.url_video, v.cover_url, v.detail, c.category
    FROM video v
    INNER JOIN category c ON c.id = v.cate_id
    WHERE c.id = ?
  `;
  connection.query(query, [category_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch videos by category" });
    }
    res.json(results);
  });
});

// API để lấy danh sách video theo category
app.get("/api/videos/category/:category_id", (req, res) => {
  const { category_id } = req.params;
  const query = `
    SELECT v.video_id, v.title, v.url_video, v.cover_url, v.detail, c.category
    FROM video v
    INNER JOIN category c ON c.id = v.cate_id
    WHERE c.id = ?
  `;
  connection.query(query, [category_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch videos by category" });
    }
    res.json(results);
  });
});

// API để lấy danh sách category hiện trên trang chủ
app.get("/api/categories", (req, res) => {
  const query = "SELECT id, category FROM category";
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch categories" });
    }
    res.json(results);
  });
});

// API để lấy tất cả các video
app.get("/api/videos", (req, res) => {
  const query = `
    SELECT v.video_id, v.title, v.url_video, v.cover_url, v.detail, c.category
    FROM video v
    INNER JOIN category c ON c.id = v.cate_id
  `;
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch videos" });
    }
    res.json(results);
  });
});


// API để xử lý dữ liệu form liên hệ
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  const query =
    "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";
  connection.query(query, [name, email, message], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send message" });
    }
    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  });
});

// API để lấy danh sách tin nhắn liên hệ
app.get("/api/contact-messages", (req, res) => {
  const query = "SELECT * FROM contact_messages";
  connection.query(query, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to fetch contact messages" });
    }
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
