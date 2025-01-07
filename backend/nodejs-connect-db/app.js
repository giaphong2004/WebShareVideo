const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const path = require("path");
const cors = require("cors"); // Import cors
const mysql = require("mysql");
const { get } = require("http");

const app = express();

app.use(bodyParser.json());

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
          request.session.userId = results[0].user_id; // Lưu userId vào session
          request.session.username = username;
          request.session.role = results[0].role; // Lưu role vào session
          response.json({ success: true, role: results[0].role });
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
      return res
        .status(500)
        .json({ error: "Failed to fetch videos by category" });
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


// API để thêm category
app.post('/api/categories', (req, res) => {
  const { category } = req.body;
  const sql = 'INSERT INTO category (category) VALUES (?)';
  connection.query(sql, [category], (err, result) => {
    if (err) {
      console.error('Error adding category:', err);
      res.status(500).send({ error: 'Error adding category' });
    } else {
      res.send({ message: 'Category added successfully' });
    }
  });
});
  // API để cập nhật category
  app.put('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    const { category } = req.body;
    const sql = 'UPDATE category SET category = ? WHERE id = ?';
    connection.query(sql, [category, id], (err, result) => {
      if (err) {
        console.error('Error updating category:', err);
        res.status(500).send({ error: 'Error updating category' });
      } else if (result.affectedRows === 0) {
        res.status(404).send({ error: 'Category not found' });
      } else {
        res.send({ message: 'Category updated successfully' });
      }
    });
  });

  //API để lấy thông tin category theo id
  app.get('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM category WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error fetching category:', err);
        res.status(500).send('Error fetching category');
      } else if (result.length === 0) {
        res.status(404).send('Category not found');
      } else {
        res.json(result[0]);
      }
    });
  });

// API để xóa category
  app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM category WHERE id = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting category:', err);
      res.status(500).send({ error: 'Error deleting category' });
    } else if (result.affectedRows === 0) {
      res.status(404).send({ error: 'Category not found' });
    } else {
      res.send({ message: 'Category deleted successfully' });
    }
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

// API để lấy dữ liệu video theo ID
app.get("/api/video/:video_id", (req, res) => {
  const { video_id } = req.params;
  const query = `
    SELECT v.video_id, v.title, v.url_video, v.cover_url, v.detail, c.category, v.cate_id
    FROM video v
    INNER JOIN category c ON c.id = v.cate_id
    WHERE v.video_id = ?
  `;
  connection.query(query, [video_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch video" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json(result[0]);
  });
});

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
  const sql =
    "UPDATE video SET title = ?, url_video = ?, cover_url = ?, detail = ?, cate_id = ? WHERE video_id = ?";
  connection.query(
    sql,
    [title, url_video, cover_url, detail, cate_id, video_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update video" });
      }
      res.json({ success: true, message: "Cập nhật thông tin thành công!" });
    }
  );
});

// Xóa video
// API để xóa video
app.delete("/api/video/:video_id", (req, res) => {
  const { video_id } = req.params;
  const sql = "DELETE FROM video WHERE video_id = ?";
  connection.query(sql, [video_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete video" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json({ success: true, message: "Video deleted successfully!" });
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

// API để lấy các video tương tự dựa trên ID của video hiện tại
app.get("/api/video/:video_id/similar", (req, res) => {
  const { video_id } = req.params;
  // Truy vấn để lấy cate_id của video hiện tại
  const getCategoryQuery = `
    SELECT cate_id FROM video WHERE video_id = ?
  `;
  connection.query(getCategoryQuery, [video_id], (err, categoryResults) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch category" });
    }
    if (categoryResults.length === 0) {
      return res.status(404).json({ error: "Video not found" });
    }
    const cate_id = categoryResults[0].cate_id;
    // Truy vấn để lấy các video tương tự
    const getSimilarVideosQuery = `
      SELECT v.video_id, v.title, v.url_video, v.cover_url, v.detail, c.category
      FROM video v
      INNER JOIN category c ON c.id = v.cate_id
      WHERE v.video_id != ? AND v.cate_id = ?
      LIMIT 5
    `;
    connection.query(
      getSimilarVideosQuery,
      [video_id, cate_id],
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Failed to fetch similar videos" });
        }
        res.json(results);
      }
    );
  });
});

app.get("/api/comments", (req, res) => {
  const query = "SELECT * FROM comment";
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch comments" });
    }
    res.json(results);
  });
});


// API để lấy danh sách comment theo video_id
app.get("/api/comments/:video_id", (req, res) => {
  const { video_id } = req.params;
  const query = `
    SELECT cm.comment_id, cm.comment, u.user_uname 
    FROM comment cm 
    INNER JOIN user u ON u.user_id = cm.user_id 
    WHERE cm.video_id = ?
  `;
  connection.query(query, [video_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch comments" });
    }
    res.json(results);
  });
});

// API để thêm comment
app.post("/api/comments/:video_id", (req, res) => {
  const { comment, user_id, video_id } = req.body;
  const query = "INSERT INTO comment (comment, user_id, video_id) VALUES (?, ?, ?)";
  connection.query(query, [comment, user_id, video_id], (err, results) => {
    if (err) {
      console.error(err.stack);
      return res.status(500).json({ error: "Failed to add comment" });
    }
    res.json({ success: true, message: "Comment added successfully!" });
  });
});

// API để xóa comment
app.delete("/api/comment/:comment_id", (req, res) => {
  const { comment_id } = req.params;
  const sql = "DELETE FROM comment WHERE comment_id = ?";
  connection.query(sql, [comment_id], (err, result) => {
    if (err) throw err;
    res.send("Đã xoá");
  });
});

// get categories
app.get("categories", (req, res) => {
  const query = "SELECT * FROM category";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching categories:", err);
      res.status(500).send("Error fetching categories");
    } else {
      res.json(results);
    }
  });
});

// Middleware để kiểm tra quyền của người dùng
function checkRole(role) {
  return (req, res, next) => {
    const userId = req.session.userId; // Giả sử bạn lưu trữ userId trong session
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const query = "SELECT role FROM user WHERE user_id = ?";
    connection.query(query, [userId], (err, results) => {
      if (err || results.length === 0) {
        return res.status(500).json({ error: "Failed to fetch user role" });
      }

      const userRole = results[0].role;
      if (userRole !== role) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    });
  };
}

// Ví dụ sử dụng middleware để kiểm tra quyền admin
app.get("/api/admin", checkRole("admin"), (req, res) => {
  res.json({ message: "Welcome, admin!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
