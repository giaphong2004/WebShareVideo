const express = require('express');
const router = express.Router();
const db = require('../models/db');

// API để lấy danh sách người dùng
router.get('/video', (req, res) => {
    const query = 'SELECT * FROM video';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
        res.json(results);
    });
});

module.exports = router;
