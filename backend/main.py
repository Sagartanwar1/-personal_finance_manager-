from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
import sqlite3
from typing import List, Optional
from datetime import datetime

app = FastAPI(title="Personal Finance API")

DB = "finance.db"

# Allow local frontend to talk to API during dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TransactionCreate(BaseModel):
    type: str
    category: str
    amount: float
    date: str  # YYYY-MM-DD

    @validator("type")
    def type_must_be_income_or_expense(cls, v):
        v_low = v.lower()
        if v_low not in ("income", "expense"):
            raise ValueError("type must be 'income' or 'expense'")
        return v_low

    @validator("date")
    def date_must_be_iso(cls, v):
        try:
            # validate format YYYY-MM-DD
            datetime.strptime(v, "%Y-%m-%d")
        except Exception:
            raise ValueError("date must be in YYYY-MM-DD format")
        return v


class TransactionOut(BaseModel):
    id: int
    type: str
    category: str
    amount: float
    date: str


class BudgetCreate(BaseModel):
    category: str
    amount: float
    month: str  # YYYY-MM

    @validator("month")
    def month_must_be_yyyy_mm(cls, v):
        try:
            datetime.strptime(v, "%Y-%m")
        except Exception:
            raise ValueError("month must be in YYYY-MM format")
        return v


class BudgetOut(BaseModel):
    id: int
    category: str
    amount: float
    month: str


def get_conn():
    # allow sqlite from multiple threads in dev; in production use Postgres/SQLAlchemy
    return sqlite3.connect(DB, check_same_thread=False)


@app.on_event("startup")
def startup():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS budgets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            month TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()


@app.post("/transactions", response_model=dict, status_code=201)
def create_transaction(t: TransactionCreate):
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO transactions (type, category, amount, date) VALUES (?, ?, ?, ?)",
            (t.type, t.category, t.amount, t.date),
        )
        conn.commit()
        return {"status": "ok"}
    finally:
        conn.close()


@app.get("/transactions", response_model=List[TransactionOut])
def list_transactions(month: Optional[str] = None, limit: int = 500):
    conn = get_conn()
    try:
        cur = conn.cursor()
        if month:
            # filter by YYYY-MM
            cur.execute(
                "SELECT id, type, category, amount, date FROM transactions WHERE strftime('%Y-%m', date) = ? ORDER BY date DESC LIMIT ?",
                (month, limit),
            )
        else:
            cur.execute(
                "SELECT id, type, category, amount, date FROM transactions ORDER BY date DESC LIMIT ?",
                (limit,),
            )
        rows = cur.fetchall()
        return [{"id": r[0], "type": r[1], "category": r[2], "amount": r[3], "date": r[4]} for r in rows]
    finally:
        conn.close()


@app.get("/transactions/{tx_id}", response_model=TransactionOut)
def get_transaction(tx_id: int):
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, type, category, amount, date FROM transactions WHERE id = ?",
            (tx_id,),
        )
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="transaction not found")
        return {"id": row[0], "type": row[1], "category": row[2], "amount": row[3], "date": row[4]}
    finally:
        conn.close()


@app.post("/budgets", response_model=dict, status_code=201)
def create_budget(b: BudgetCreate):
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute("INSERT INTO budgets (category, amount, month) VALUES (?, ?, ?)", (b.category, b.amount, b.month))
        conn.commit()
        return {"status": "ok"}
    finally:
        conn.close()


@app.get("/budgets", response_model=List[BudgetOut])
def list_budgets(month: Optional[str] = None):
    conn = get_conn()
    try:
        cur = conn.cursor()
        if month:
            cur.execute("SELECT id, category, amount, month FROM budgets WHERE month = ? ORDER BY category", (month,))
        else:
            cur.execute("SELECT id, category, amount, month FROM budgets ORDER BY month DESC, category")
        rows = cur.fetchall()
        return [{"id": r[0], "category": r[1], "amount": r[2], "month": r[3]} for r in rows]
    finally:
        conn.close()