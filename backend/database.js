const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database
const dbPath = path.resolve(__dirname, 'fitness.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Initialize Tables
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                data TEXT
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS workout_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                date TEXT,
                exId TEXT,
                mode TEXT,
                sets INTEGER,
                reps INTEGER,
                weight REAL,
                prLabel TEXT,
                FOREIGN KEY(userId) REFERENCES users(id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS bodyweight_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                date TEXT,
                weight REAL,
                FOREIGN KEY(userId) REFERENCES users(id)
            )
        `);
    }
});

module.exports = db;
