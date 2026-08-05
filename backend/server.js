const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// API Routes

// USERS
app.post('/api/users', (req, res) => {
    const { username, data } = req.body;
    db.run(
        `INSERT INTO users (username, data) VALUES (?, ?)`, 
        [username, JSON.stringify(data)], 
        function(err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, username, data });
        }
    );
});

app.get('/api/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows.map(r => ({ ...r, data: JSON.parse(r.data) })));
    });
});

// LIVE WORKOUT LOGS
app.post('/api/workout-logs', (req, res) => {
    const { userId, date, exId, mode, sets, reps, weight, prLabel } = req.body;
    db.run(
        `INSERT INTO workout_logs (userId, date, exId, mode, sets, reps, weight, prLabel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, date, exId, mode, sets, reps, weight, prLabel],
        function(err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
});

app.get('/api/workout-logs/:userId', (req, res) => {
    db.all(`SELECT * FROM workout_logs WHERE userId = ?`, [req.params.userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// BODYWEIGHT LOGS
app.post('/api/bodyweight', (req, res) => {
    const { userId, date, weight } = req.body;
    db.run(
        `INSERT INTO bodyweight_logs (userId, date, weight) VALUES (?, ?, ?)`,
        [userId, date, weight],
        function(err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
});

app.get('/api/bodyweight/:userId', (req, res) => {
    db.all(`SELECT * FROM bodyweight_logs WHERE userId = ? ORDER BY date ASC`, [req.params.userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
