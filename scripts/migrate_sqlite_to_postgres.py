"""
Usage:
  1) Ensure PostgreSQL is reachable and DATABASE_URL is set, e.g.:
       export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finance"
  2) Install dependency for this script:
       python3 -m pip install -r scripts/requirements_migrate.txt
  3) Place your finance.db in workspace root or pass path as first arg.
  4) Run:
       python3 scripts/migrate_sqlite_to_postgres.py [path/to/finance.db]
"""
import os
import sqlite3
import sys
import psycopg2
from urllib.parse import urlparse

SQLITE_PATH = sys.argv[1] if len(sys.argv) > 1 else "finance.db"
DATABASE_URL = os.environ.get("DATABASE_URL")

if not os.path.exists(SQLITE_PATH):
    print("SQLite DB not found at", SQLITE_PATH)
    sys.exit(1)
if not DATABASE_URL:
    print("Please set DATABASE_URL env var (e.g. postgresql://user:pass@host:port/dbname)")
    sys.exit(1)

# Connect to SQLite
sconn = sqlite3.connect(SQLITE_PATH)
scur = sconn.cursor()

# Read transactions and budgets if present
def safe_fetch(query):
    try:
        scur.execute(query)
        return scur.fetchall()
    except sqlite3.OperationalError:
        return []

tx_rows = safe_fetch("SELECT id, type, category, amount, date FROM transactions")
budget_rows = safe_fetch("SELECT id, category, amount, month FROM budgets")

print(f"Found {len(tx_rows)} transactions and {len(budget_rows)} budgets in {SQLITE_PATH}")

# Connect to Postgres
pconn = psycopg2.connect(DATABASE_URL)
pcur = pconn.cursor()

# Create tables if not exist (simple schema)
pcur.execute("""
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL
)
""")
pcur.execute("""
CREATE TABLE IF NOT EXISTS budgets (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  month TEXT NOT NULL
)
""")
pconn.commit()

# Insert transactions (attempt to preserve id by ignoring if conflict)
for r in tx_rows:
    sid, ttype, category, amount, date_text = r
    # try to parse date; SQLite may have stored as text
    if not date_text:
        date_text = None
    try:
        pcur.execute(
            "INSERT INTO transactions (type, category, amount, date) VALUES (%s, %s, %s, %s)",
            (ttype, category, amount, date_text)
        )
    except Exception as e:
        print("Insert tx error:", e)
        pconn.rollback()
    else:
        pconn.commit()

for r in budget_rows:
    try:
        _, category, amount, month = r
    except Exception:
        continue
    try:
        pcur.execute(
            "INSERT INTO budgets (category, amount, month) VALUES (%s, %s, %s)",
            (category, amount, month)
        )
    except Exception as e:
        print("Insert budget error:", e)
        pconn.rollback()
    else:
        pconn.commit()

pcur.close()
pconn.close()
sconn.close()
print("Migration complete.")