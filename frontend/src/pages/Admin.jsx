import React, { useEffect, useState } from "react";
import { api, formatMoney, formatDate } from "@/lib/api";
import { Users, TrendingUp, Wallet, Clock, CheckCircle2, X } from "lucide-react";

const Tab = ({ active, onClick, children, testid }) => (
  <button onClick={onClick} data-testid={testid}
    className={`px-4 py-2 text-sm border-b-2 transition ${active ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
    {children}
  </button>
);

export default function Admin() {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingKyc, setPendingKyc] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const loadAll = async () => {
    const [s, p, u, k, a] = await Promise.all([
      api.get("/admin/analytics"),
      api.get("/transactions/pending"),
      api.get("/admin/users"),
      api.get("/kyc/pending"),
      api.get("/admin/audit-logs"),
    ]);
    setStats(s.data); setPending(p.data); setUsers(u.data); setPendingKyc(k.data); setAuditLogs(a.data);
  };

  useEffect(() => { loadAll(); }, []);

  const decideTx = async (id, decision) => {
    await api.post(`/transactions/${id}/decision`, { decision });
    await loadAll();
  };
  const decideKyc = async (userId, decision) => {
    await api.post(`/kyc/${userId}/decision?decision=${decision}`);
    await loadAll();
  };

  return (
    <div className="space-y-6" data-testid="admin-root">
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-accent">Admin</div>
        <h1 className="font-serif text-4xl mt-2">Control room</h1>
      </div>

      <div className="border-b border-border flex flex-wrap gap-2">
        <Tab active={tab === "overview"} onClick={() => setTab("overview")} testid="admin-tab-overview">Overview</Tab>
        <Tab active={tab === "pending"} onClick={() => setTab("pending")} testid="admin-tab-pending">Pending TX ({pending.length})</Tab>
        <Tab active={tab === "kyc"} onClick={() => setTab("kyc")} testid="admin-tab-kyc">KYC ({pendingKyc.length})</Tab>
        <Tab active={tab === "users"} onClick={() => setTab("users")} testid="admin-tab-users">Users</Tab>
        <Tab active={tab === "audit"} onClick={() => setTab("audit")} testid="admin-tab-audit">Audit log</Tab>
      </div>

      {tab === "overview" && stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="admin-overview">
          {[
            { l: "Total users", v: stats.total_users, i: Users },
            { l: "Active investments", v: stats.active_investments, i: TrendingUp },
            { l: "AUM", v: formatMoney(stats.aum), i: Wallet },
            { l: "Deposit volume", v: formatMoney(stats.deposit_volume), i: Wallet },
            { l: "Withdrawal volume", v: formatMoney(stats.withdrawal_volume), i: Wallet },
            { l: "Pending deposits", v: stats.pending_deposits, i: Clock },
            { l: "Pending withdrawals", v: stats.pending_withdrawals, i: Clock },
          ].map((s) => (
            <div key={s.l} className="bg-card border border-border rounded-lg p-5 elev-hover">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{s.l}</div>
                <s.i className="w-4 h-4 text-accent" />
              </div>
              <div className="mt-3 font-mono-fin text-2xl">{s.v}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "pending" && (
        <div className="bg-card border border-border rounded-lg overflow-hidden" data-testid="admin-pending-list">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Type</th><th className="px-4 py-3">User</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Method</th><th className="px-4 py-3">Date</th><th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pending.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted-foreground py-10">No pending transactions.</td></tr>
              ) : pending.map((t) => (
                <tr key={t.id} data-testid={`pending-tx-${t.id}`}>
                  <td className="px-4 py-3 capitalize">{t.type}</td>
                  <td className="px-4 py-3 text-xs font-mono-fin">{t.user_id.slice(0, 8)}…</td>
                  <td className="px-4 py-3 font-mono-fin">{formatMoney(t.amount)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.method}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(t.created_at)}</td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <button onClick={() => decideTx(t.id, "approve")} data-testid={`approve-${t.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-success text-white rounded hover:opacity-90"><CheckCircle2 className="w-3 h-3" />Approve</button>
                    <button onClick={() => decideTx(t.id, "reject")} data-testid={`reject-${t.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-destructive text-destructive-foreground rounded hover:opacity-90"><X className="w-3 h-3" />Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "kyc" && (
        <div className="bg-card border border-border rounded-lg overflow-hidden" data-testid="admin-kyc-list">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Name</th><th className="px-4 py-3">Country</th><th className="px-4 py-3">Doc</th><th className="px-4 py-3">Submitted</th><th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pendingKyc.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted-foreground py-10">No pending KYC submissions.</td></tr>
              ) : pendingKyc.map((k) => (
                <tr key={k.id} data-testid={`pending-kyc-${k.user_id}`}>
                  <td className="px-4 py-3">{k.full_legal_name}</td>
                  <td className="px-4 py-3">{k.country}</td>
                  <td className="px-4 py-3 capitalize">{k.document_type.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(k.submitted_at)}</td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <button onClick={() => decideKyc(k.user_id, "approve")} data-testid={`kyc-approve-${k.user_id}`}
                      className="px-3 py-1.5 text-xs bg-success text-white rounded hover:opacity-90">Approve</button>
                    <button onClick={() => decideKyc(k.user_id, "reject")} data-testid={`kyc-reject-${k.user_id}`}
                      className="px-3 py-1.5 text-xs bg-destructive text-destructive-foreground rounded hover:opacity-90">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "users" && (
        <div className="bg-card border border-border rounded-lg overflow-hidden" data-testid="admin-users-list">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">KYC</th><th className="px-4 py-3">Balance</th><th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3 capitalize">{u.kyc_status}</td>
                  <td className="px-4 py-3 font-mono-fin">{formatMoney(u.balance)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(u.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "audit" && (
        <div className="bg-card border border-border rounded-lg overflow-hidden" data-testid="admin-audit-list">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Event</th><th className="px-4 py-3">User</th><th className="px-4 py-3">IP</th><th className="px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {auditLogs.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3 text-xs font-mono-fin">{l.event_type}</td>
                  <td className="px-4 py-3 text-xs font-mono-fin text-muted-foreground">{l.user_id ? l.user_id.slice(0, 8) + "…" : "—"}</td>
                  <td className="px-4 py-3 text-xs font-mono-fin">{l.ip || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
