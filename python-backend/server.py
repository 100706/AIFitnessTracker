"""
FitnessAI Python Backend — Flask server.
Drop-in replacement for backend/server.js.  Exposes the exact same REST API
so the React frontend works without any changes.

Endpoints
─────────
POST   /api/users                  Create a user
GET    /api/users                  List all users
POST   /api/workout-logs           Log a workout set
GET    /api/workout-logs/<userId>  Get all workout logs for a user
POST   /api/bodyweight             Log a bodyweight entry
GET    /api/bodyweight/<userId>    Get bodyweight logs for a user (ASC)
POST   /api/ai/generate            Generate text with Gemini
"""

import json
import os
import traceback

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

from database import get_db, init_db

# ── Bootstrap ──────────────────────────────────────────────────────────────────
load_dotenv()

app = Flask(__name__)
CORS(app)                          # allow all origins, same as the Node.js backend

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PORT = int(os.getenv("PORT", 5000))

# ── USERS ──────────────────────────────────────────────────────────────────────

@app.route("/api/users", methods=["POST"])
def create_user():
    """Create a new user.  Expects JSON body: { username, data }."""
    body = request.get_json(force=True)
    username = body.get("username")
    data = body.get("data", {})

    if not username:
        return jsonify({"error": "username is required"}), 400

    conn = get_db()
    try:
        cursor = conn.execute(
            "INSERT INTO users (username, data) VALUES (?, ?)",
            (username, json.dumps(data)),
        )
        conn.commit()
        user_id = cursor.lastrowid
        return jsonify({"id": user_id, "username": username, "data": data})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400
    finally:
        conn.close()


@app.route("/api/users", methods=["GET"])
def get_users():
    """Return every user with their parsed JSON data."""
    conn = get_db()
    try:
        rows = conn.execute("SELECT * FROM users").fetchall()
        users = []
        for row in rows:
            user = dict(row)
            user["data"] = json.loads(user["data"]) if user["data"] else {}
            users.append(user)
        return jsonify(users)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
    finally:
        conn.close()


# ── WORKOUT LOGS ───────────────────────────────────────────────────────────────

@app.route("/api/workout-logs", methods=["POST"])
def create_workout_log():
    """Log a workout set.
    Body: { userId, date, exId, mode, sets, reps, weight, prLabel }
    """
    body = request.get_json(force=True)
    conn = get_db()
    try:
        cursor = conn.execute(
            """INSERT INTO workout_logs
               (userId, date, exId, mode, sets, reps, weight, prLabel)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                body.get("userId"),
                body.get("date"),
                body.get("exId"),
                body.get("mode"),
                body.get("sets"),
                body.get("reps"),
                body.get("weight"),
                body.get("prLabel"),
            ),
        )
        conn.commit()
        return jsonify({"id": cursor.lastrowid})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400
    finally:
        conn.close()


@app.route("/api/workout-logs/<user_id>", methods=["GET"])
def get_workout_logs(user_id):
    """Return all workout logs for a given userId."""
    conn = get_db()
    try:
        rows = conn.execute(
            "SELECT * FROM workout_logs WHERE userId = ?", (user_id,)
        ).fetchall()
        return jsonify([dict(r) for r in rows])
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
    finally:
        conn.close()


# ── BODYWEIGHT LOGS ────────────────────────────────────────────────────────────

@app.route("/api/bodyweight", methods=["POST"])
def create_bodyweight_log():
    """Log a bodyweight entry.  Body: { userId, date, weight }"""
    body = request.get_json(force=True)
    conn = get_db()
    try:
        cursor = conn.execute(
            "INSERT INTO bodyweight_logs (userId, date, weight) VALUES (?, ?, ?)",
            (body.get("userId"), body.get("date"), body.get("weight")),
        )
        conn.commit()
        return jsonify({"id": cursor.lastrowid})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400
    finally:
        conn.close()


@app.route("/api/bodyweight/<user_id>", methods=["GET"])
def get_bodyweight_logs(user_id):
    """Return bodyweight logs for a userId, sorted by date ascending."""
    conn = get_db()
    try:
        rows = conn.execute(
            "SELECT * FROM bodyweight_logs WHERE userId = ? ORDER BY date ASC",
            (user_id,),
        ).fetchall()
        return jsonify([dict(r) for r in rows])
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
    finally:
        conn.close()


# ── GEMINI AI ──────────────────────────────────────────────────────────────────

@app.route("/api/ai/generate", methods=["POST"])
def ai_generate():
    """Forward a prompt to Google Gemini and return the response text."""
    body = request.get_json(force=True)
    prompt = body.get("prompt")

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    if not GEMINI_API_KEY:
        return jsonify({"error": "Gemini API key not configured on server."}), 503

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }
        headers = {"Content-Type": "application/json"}
        
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        # Extract text from the Gemini response structure
        result_text = data.get("candidates", [])[0].get("content", {}).get("parts", [])[0].get("text", "")
        
        return jsonify({"response": result_text})
    except Exception as exc:
        traceback.print_exc()
        return jsonify({"error": str(exc)}), 500


# ── Entrypoint ─────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    init_db()
    print(f"🚀 Python server running on port {PORT}")
    app.run(host="0.0.0.0", port=PORT, debug=True)
