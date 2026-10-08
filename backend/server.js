require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


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

// ── GEMINI AI ──────────────────────────────────────────────────────────────────

app.post('/api/ai/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        if (!process.env.GEMINI_API_KEY) {
            return res.status(503).json({ error: 'Gemini API key not configured on server.' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        res.json({ response: text });
    } catch (err) {
        console.error('Gemini API error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
