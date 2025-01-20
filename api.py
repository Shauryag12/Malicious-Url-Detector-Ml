from flask import Flask, request, jsonify
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Define the SQLite database file
DB_FILE = 'mydb.db'

# Function to initialize the database using the SQL file
def init_db_from_file():
    print("Initializing database from url.sql...")
    with open('url.sql', 'r') as f:
        sql_script = f.read()
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.executescript(sql_script)
    conn.commit()
    conn.close()
    print("Database initialized successfully.")


# Initialize the database
init_db_from_file()

# API endpoint to handle user signup
@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        # Hash the password
        password_hash = generate_password_hash(password)

        # Insert the new user into the database
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (email, password_hash) VALUES (?, ?)', (email, password_hash))
        conn.commit()
        conn.close()

        return jsonify({"message": "User registered successfully"}), 201

    except sqlite3.IntegrityError:
        return jsonify({"message": "Email already exists"}), 400

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# API endpoint to handle user login
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        # Fetch the user's hashed password from the database
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('SELECT password_hash FROM users WHERE email = ?', (email,))
        result = cursor.fetchone()
        conn.close()

        if result is None:
            return jsonify({"message": "Invalid email or password"}), 401

        # Validate the password
        password_hash = result[0]
        if not check_password_hash(password_hash, password):
            return jsonify({"message": "Invalid email or password"}), 401

        return jsonify({"message": "Login successful"}), 200

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# API endpoint to add a URL
@app.route('/add_url', methods=['POST'])
def add_url():
    try:
        data = request.json
        url = data.get('url')
        is_malicious = data.get('is_malicious', 0)

        if not url:
            return jsonify({"message": "URL is required"}), 400

        # Insert the URL into the database
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO urls (url, is_malicious) VALUES (?, ?)', (url, is_malicious))
        conn.commit()
        conn.close()

        return jsonify({"message": "URL added successfully"}), 201

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# API endpoint to fetch all URLs
@app.route('/get_urls', methods=['GET'])
def get_urls():
    try:
        # Fetch all URLs from the database
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM urls')
        urls = cursor.fetchall()
        conn.close()

        # Format the data
        urls_list = [
            {"id": row[0], "url": row[1], "is_malicious": row[2], "created_at": row[3]}
            for row in urls
        ]

        return jsonify({"urls": urls_list}), 200

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
