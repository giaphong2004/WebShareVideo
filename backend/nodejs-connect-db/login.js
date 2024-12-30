const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors'); // Import cors

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'stream_hub'
});

connection.connect(function(err) {
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
app.use(express.static(path.join(__dirname, 'static')));

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
app.get('/', function(request, response) {
    // Render login template
    response.sendFile(path.join(__dirname + '/login.html'));
});

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
    // Capture the input fields
    let username = request.body.username;
    let password = request.body.password;
    // Ensure the input fields exists and are not empty
    if (username && password) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
        connection.query('SELECT * FROM user WHERE user_uname = ? AND password = ?', [username, password], function(error, results, fields) {
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
                response.json({ success: false, message: 'Incorrect Username and/or Password!' });
            }			
            response.end();
        });
    } else {
        response.json({ success: false, message: 'Please enter Username and Password!' });
        response.end();
    }
});

// http://localhost:3000/home
app.get('/home', requireLogin, function(request, response) {
    // Output username
    response.send('Welcome back, ' + request.session.username + '!');
    response.end();
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});