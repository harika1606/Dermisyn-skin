import sqlite3
import os

db_path = 'dermisyn.db'

if not os.path.exists(db_path):
    print(f"Error: {db_path} not found.")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print("--- Tables ---")
for table in tables:
    table_name = table[0]
    print(f"\nTable: {table_name}")
    
    # Get schema
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = cursor.fetchall()
    print("Columns:")
    for col in columns:
        print(f"  - {col[1]} ({col[2]})")
    
    # Get row count
    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
    count = cursor.fetchone()[0]
    print(f"Row count: {count}")

print("\n" + "="*50)
print("--- LATEST 10 CLINICAL SCANS ---")
print("="*50)
print(f"{'ID':<4} | {'PREDICTION':<25} | {'CONF%':<6} | {'LOCATION':<10} | {'DATE'}")
print("-" * 75)

cursor.execute("SELECT id, prediction, confidence, location, created_at FROM scan ORDER BY created_at DESC LIMIT 10")
scans = cursor.fetchall()
for s in scans:
    print(f"{s[0]:<4} | {str(s[1])[:25]:<25} | {s[2]:<6} | {str(s[3]):<10} | {s[4]}")

conn.close()
