import sqlite3
import pymysql
import os

# Configuration
SQLITE_DB = 'dermisyn.db'
MYSQL_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '@Harika2711',
    'database': 'skynex_db'
}

if not os.path.exists(SQLITE_DB):
    print("SQLite database not found. Nothing to migrate.")
    exit()

try:
    # Connect to SQLite
    sl_conn = sqlite3.connect(SQLITE_DB)
    sl_cur = sl_conn.cursor()

    # Connect to MySQL
    my_conn = pymysql.connect(**MYSQL_CONFIG)
    my_cur = my_conn.cursor()

    print("--- Migrating Users ---")
    sl_cur.execute("SELECT id, name, email, password_hash, created_at FROM user")
    users = sl_cur.fetchall()
    for u in users:
        try:
            my_cur.execute("INSERT IGNORE INTO user (id, name, email, password_hash, created_at) VALUES (%s, %s, %s, %s, %s)", u)
        except Exception as e:
            print(f"User {u[2]} already exists or error: {e}")

    print("--- Migrating Scans ---")
    sl_cur.execute("SELECT id, user_id, prediction, confidence, risk_level, location, image_url, created_at FROM scan")
    scans = sl_cur.fetchall()
    for s in scans:
        try:
            my_cur.execute("INSERT IGNORE INTO scan (id, user_id, prediction, confidence, risk_level, location, image_url, created_at) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", s)
        except Exception as e:
            print(f"Scan {s[0]} error: {e}")

    my_conn.commit()
    print("\n[SUCCESS] Migration complete! Your MySQL Workbench will now show all records.")

    sl_conn.close()
    my_conn.close()

except Exception as e:
    print(f"[ERROR] Migration failed: {e}")
