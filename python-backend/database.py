"""
Database module for the FitnessAI Python backend.
Manages SQLite connection and table initialization — mirrors backend/database.js.
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fitness.db")


def get_db():
    """
    Return a new SQLite connection with Row factory enabled so results
    can be accessed as dictionaries.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")       # better concurrent reads
    conn.execute("PRAGMA foreign_keys = ON")       # enforce FK constraints
    return conn


def init_db():
    """Create tables if they don't already exist."""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            data TEXT
        )
    """)

    cursor.execute("""
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
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bodyweight_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            date TEXT,
            weight REAL,
            FOREIGN KEY(userId) REFERENCES users(id)
        )
    """)

    conn.commit()
    conn.close()
    print(f"✅ Connected to SQLite database at {DB_PATH}")
