import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchTransactions() {
  const res = await axios.get(`${BASE}/transactions`);
  return res.data;
}

export async function postTransaction(payload: { type: string; category: string; amount: number; date: string }) {
  const res = await axios.post(`${BASE}/transactions`, payload);
  return res.data;
}