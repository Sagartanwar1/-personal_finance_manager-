import React from "react";
import Link from "next/link";

export default function Layout({ children, title = "Personal Finance" }: { children: React.ReactNode; title?: string }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f1724", color: "#e6eef6" }}>
      <aside style={{ width: 220, padding: 24, background: "#071428" }}>
        <div style={{ fontWeight: 600, marginBottom: 18 }}>{title}</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Link href="/"><a style={{ padding: 10, borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>Dashboard</a></Link>
          <Link href="/transactions"><a style={{ padding: 10, borderRadius: 8 }}>Transactions</a></Link>
          <Link href="/report"><a style={{ padding: 10, borderRadius: 8 }}>Report</a></Link>
          <Link href="/settings"><a style={{ padding: 10, borderRadius: 8 }}>Settings</a></Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>{children}</main>
    </div>
  );
}