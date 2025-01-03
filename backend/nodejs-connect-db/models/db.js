// Tạo kết nối MySQL
const mysql = require('mysql');

// Tạo kết nối MySQL
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'streamhub_sql'
});

connection.connect(function (err) {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});
