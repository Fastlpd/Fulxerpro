import React, { useEffect, useState } from "react";
import { api, formatMoney, formatDate } from "@/lib/api";

const statusBadge = (s) => ({
  completed: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/15 text-warning border-warning/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
}[s] || "bg-secondary");

export default function Transactions() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  useEffect(() => { api.get("/transactions").then((r) => setItems(r.data)); }, []);
  const filtered = filter === "all" ? items : items.filter((t) => t.type === filter);

  return (
    <div className="space-y-6" data-testid="transactions-root">
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Ledger</div>
        <h1 className="font-serif text-4xl mt-2">Transactions</h1>
      </div>
      <div className="flex gap-2">
        {["all", "deposit", "withdrawal", "investment"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} data-testid={`tx-filter-${f}`}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded border ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}>{f}</button>
        ))}
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 border-b border-border">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted-foreground py-12" data-testid="tx-empty">No transactions yet.</td></tr>
              ) : filtered.map((t) => (
                <tr key={t.id} data-testid={`tx-row-${t.id}`}>
                  <td className="px-4 py-3 font-mono-fin text-xs text-muted-foreground">{t.id.slice(0, 8)}…</td>
                  <td className="px-4 py-3 capitalize">{t.type}</td>
                  <td className="px-4 py-3 font-mono-fin">{formatMoney(t.amount)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.method || "—"}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 border rounded text-[10px] uppercase tracking-wider ${statusBadge(t.status)}`}>{t.status}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(t.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
