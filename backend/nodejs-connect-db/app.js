const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors'); // Import cors
const db = require('./models/db');


// Import các routes
const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');


// Khởi tạo server
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sử dụng các routes
app.use('/api', userRoutes);
app.use('/api', videoRoutes);


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
    // Render login template
    response.sendFile(path.join(__dirname, 'login.html'));
    
});

// http://localhost:3000/register
app.get('/register', function (request, response) {
    // Hiển thị trang đăng ký
    response.sendFile(path.join(__dirname, 'register.html'));
});



// http://localhost:3000/auth
app.post('/auth', function (request, response) {
    // Capture the input fields
    let username = request.body.username;
    let password = request.body.password;
    // Ensure the input fields exists and are not empty
    if (username && password) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
        db.query('SELECT * FROM user WHERE user_uname = ? AND password = ?', [username, password], function (error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results.length > 0) {
                // Authenticate the user
                request.session.loggedin = true;
                request.session.username = username;
                // Send success response
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
    // Capture the input fields
    let username = request.body.username;
    let password = request.body.password;
    let email = request.body.email;
    // Ensure the input fields exists and are not empty
    if (username && password && email) {
        // Execute SQL query that'll select the account from the database based on the specified username
        db.query('SELECT * FROM user WHERE user_uname = ?', [username], function (error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) {
                response.status(500).json({ success: false, message: 'Database query error' });
                return;
            }
            // If the account already exists
            if (results.length > 0) {
                response.status(400).json({ success: false, message: 'Username already exists' });
            } else {
                // Execute SQL query that'll insert the account into the database
                db.query('INSERT INTO user (user_uname, password, email) VALUES (?, ?, ?)', [username, password, email], function (error, results) {
                    // If there is an issue with the query, output the error
                    if (error) {
                        response.status(500).json({ success: false, message: 'Database insert error' });
                        return;
                    }
                    // Send success response
                    response.status(200).json({ success: true, message: 'Registration successful' });
                });
            }
        });
    } else {
        response.status(400).json({ success: false, message: 'Please enter all required fields' });
    }
});



// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
