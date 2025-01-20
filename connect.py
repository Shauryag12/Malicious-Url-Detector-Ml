import sqlite3

def init_db():
    conn = sqlite3.connect('url_detector.db')  # Create or connect to the database
    cursor = conn.cursor()
    
    # Create the `urls` table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            is_malicious INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def add_url(url, is_malicious):
    conn = sqlite3.connect('url_detector.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO urls (url, is_malicious) VALUES (?, ?)', (url, is_malicious))
    conn.commit()
    conn.close()

def get_all_urls():
    conn = sqlite3.connect('url_detector.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM urls')
    results = cursor.fetchall()
    conn.close()
    return results

print(get_all_urls())

def process_url(url, is_malicious):
    conn = sqlite3.connect('url_detector.db')
    cursor = conn.cursor()
    
    # Check if the URL already exists
    cursor.execute('SELECT * FROM urls WHERE url = ?', (url,))
    if cursor.fetchone() is None:
        # Add the URL if not found
        cursor.execute('INSERT INTO urls (url, is_malicious) VALUES (?, ?)', (url, is_malicious))
        print(f"Added URL: {url}")
    else:
        print(f"URL already exists: {url}")
    
    conn.commit()
    conn.close()

# Example usage
process_url("http://example.com", 0)
process_url("http://malicious-site.com", 1)

def count_malicious_urls():
    conn = sqlite3.connect('url_detector.db')
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM urls WHERE is_malicious = 1')
    count = cursor.fetchone()[0]
    conn.close()
    return count

print(f"Total Malicious URLs: {count_malicious_urls()}")
