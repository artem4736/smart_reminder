from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

DB_NAME = "database.db"


# ------------------ ПІДКЛЮЧЕННЯ ДО БД ------------------
def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


# ------------------ ІНІЦІАЛІЗАЦІЯ БД ------------------
def init_db():
    db = get_db()
    cur = db.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)
    db.commit()
    db.close()


# ------------------ РЕЄСТРАЦІЯ ------------------
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "Заповніть усі поля"}), 400

    hashed_password = generate_password_hash(password)

    db = get_db()
    cur = db.cursor()

    try:
        cur.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (name, email, hashed_password)
        )
        db.commit()
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email вже існує"}), 400
    finally:
        db.close()

    return jsonify({"message": "Акаунт створено"}), 201


# ------------------ ЛОГІН ------------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    db = get_db()
    cur = db.cursor()

    # шукаємо користувача ТІЛЬКИ по email
    cur.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cur.fetchone()
    db.close()

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Невірний email або пароль"}), 401

    return jsonify({
        "id": user["id"],
        "name": user["name"],
        "email": user["email"]
    })


# ------------------ ПЕРЕГЛЯД КОРИСТУВАЧІВ (ДЛЯ ТЕСТУ) ------------------
@app.route("/api/users")
def get_users():
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT id, name, email FROM users")
    users = cur.fetchall()
    db.close()

    return jsonify([dict(u) for u in users])


# ------------------ ЗАПУСК ------------------
if __name__ == "__main__":
    init_db()
    app.run(debug=True)
