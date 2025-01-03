const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors'); // Import cors
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'streamhub_sql'
});

connection.connect(function (err) {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});

const app = express();

app.use(cors()); // Use cors middleware

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
    if (req.session.loggedin) {
        next(); // allow the next route to run
    } else {
        // require the user to log in
        res.send('Please login to view this page!');
    }
}

// http://localhost:3000/
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'login.html'));
});

// http://localhost:3000/register
app.get('/register', function (request, response) {
    response.sendFile(path.join(__dirname, 'register.html'));
});

// http://localhost:3000/auth
app.post('/auth', function (request, response) {
    let username = request.body.username;
    let password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM user WHERE user_uname = ? AND password = ?', [username, password], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.json({ success: true });
            } else {
                response.status(400).json({ success: false, message: 'Incorrect Username and/or Password!' });
            }
            response.end();
        });
    } else {
        response.status(400).json({ success: false, message: 'Please enter Username and Password!' });
        response.end();
    }
});

// http://localhost:3000/auth/register
app.post('/auth/register', function (request, response) {
    let username = request.body.username;
    let password = request.body.password;
    let email = request.body.email;
    if (username && password && email) {
        connection.query('SELECT * FROM user WHERE user_uname = ?', [username], function (error, results, fields) {
            if (error) {
                response.status(500).json({ success: false, message: 'Database query error' });
                return;
            }
            if (results.length > 0) {
                response.status(400).json({ success: false, message: 'Username already exists' });
            } else {
                connection.query('INSERT INTO user (user_uname, password, email) VALUES (?, ?, ?)', [username, password, email], function (error, results) {
                    if (error) {
                        response.status(500).json({ success: false, message: 'Database insert error' });
                        return;
                    }
                    response.status(200).json({ success: true, message: 'Registration successful' });
                });
            }
        });
    } else {
        response.status(400).json({ success: false, message: 'Please enter all required fields' });
    }
});

// http://localhost:3000/home
app.get('/home', requireLogin, function (request, response) {
    response.send('Welcome back, ' + request.session.username + '!');
    response.end();
});

// http://localhost:3000/logout
app.get('/logout', function (request, response) {
    request.session.destroy(err => {
        if (err) {
            return response.status(500).json({ success: false, message: 'Failed to logout.' });
        }
        response.json({ success: true, message: 'Logout successful' });
    });
});

// API để lấy danh sách người dùng
app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM user';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
        res.json(results);
    });
});

// API để xử lý dữ liệu form liên hệ
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    const query = 'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)';
    connection.query(query, [name, email, message], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to send message' });
        }
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    });
});

// API để lấy danh sách tin nhắn liên hệ
app.get('/api/contact-messages', (req, res) => {
    const query = 'SELECT * FROM contact_messages';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch contact messages' });
        }
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});