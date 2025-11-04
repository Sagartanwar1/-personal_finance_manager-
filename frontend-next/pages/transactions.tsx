import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchTransactions, postTransaction } from "../lib/api";

type Tx = { id: number; type: string; category: string; amount: number; date: string };

export default function TransactionsPage() {
  const [tx, setTx] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState("expense");

  async function load() {
    setLoading(true);
    try {
      const data = await fetchTransactions();
      setTx(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!category || !amount) return;
    const payload = { type, category, amount: Number(amount), date: new Date().toISOString().slice(0,10) };
    try {
      await postTransaction(payload);
      setCategory(""); setAmount("");
      await load();
    } catch (e) {
      alert("Failed to post transaction: " + e);
    }
  }

  return (
    <Layout>
      <h1>Transactions</h1>
      <div style={{ marginBottom: 12 }}>
        <select value={type} onChange={(e) => setType(e.target.value)}><option value="expense">Expense</option><option value="income">Income</option></select>
        <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} style={{ marginLeft: 8 }} />
        <input placeholder="Amount" value={amount as any} onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")} style={{ marginLeft: 8 }} />
        <button onClick={add} style={{ marginLeft: 8 }}>Add</button>
      </div>
      {loading ? <div>Loading...</div> : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><th>ID</th><th>Type</th><th>Category</th><th>Amount</th><th>Date</th></tr></thead>
          <tbody>
            {tx.map(t => <tr key={t.id}><td>{t.id}</td><td>{t.type}</td><td>{t.category}</td><td style={{ textAlign: "right" }}>{t.amount}</td><td>{t.date}</td></tr>)}
          </tbody>
        </table>
      )}
    </Layout>
  );
}