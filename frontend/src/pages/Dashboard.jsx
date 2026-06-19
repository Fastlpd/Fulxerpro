import React, { useEffect, useState } from "react";
import { api, formatMoney, formatDate } from "@/lib/api";
import { TrendingUp, Wallet, Activity, Shield, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Link } from "react-router-dom";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--warning))", "hsl(var(--chart-2))", "hsl(var(--chart-5))"];

const KpiCard = ({ label, value, sub, icon: Icon, testid }) => (
  <div className="bg-card border border-border rounded-lg p-5 elev-hover" data-testid={testid}>
    <div className="flex items-center justify-between">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <Icon className="w-4 h-4 text-accent" />
    </div>
    <div className="mt-3 font-mono-fin text-3xl">{value}</div>
    {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/portfolio/summary").then((r) => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <div className="text-muted-foreground" data-testid="dashboard-loading">Loading your portfolio…</div>;

  const kycVerified = user.kyc_status === "verified";

  return (
    <div className="space-y-8" data-testid="dashboard-root">
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Welcome back</div>
        <h1 className="font-serif text-4xl md:text-5xl mt-2">{user.name.split(" ")[0]}'s portfolio</h1>
      </div>

      {!kycVerified && (
        <div className="bg-warning/15 border border-warning/40 rounded-md p-4 flex items-center justify-between" data-testid="kyc-banner">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-accent" />
            <div>
              <div className="font-medium">Complete your KYC to unlock investing & withdrawals</div>
              <div className="text-sm text-muted-foreground">Verification typically takes under 24 hours.</div>
            </div>
          </div>
          <Link to="/app/kyc" data-testid="kyc-banner-cta" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">Verify now</Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard testid="kpi-balance" label="Available Balance" value={formatMoney(data.balance)} icon={Wallet} sub="Ready to invest" />
        <KpiCard testid="kpi-invested" label="Total Invested" value={formatMoney(data.total_invested)} icon={TrendingUp} sub={`${data.active_count} active`} />
        <KpiCard testid="kpi-expected" label="Expected Return" value={formatMoney(data.expected_return)} icon={ArrowUpRight} sub="At maturity" />
        <KpiCard testid="kpi-earnings" label="Lifetime Earnings" value={formatMoney(data.total_earnings)} icon={Activity} sub="Matured profit" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6" data-testid="recent-tx-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl">Recent activity</h3>
            <Link to="/app/transactions" className="text-xs text-accent hover:underline">View all →</Link>
          </div>
          {data.recent_transactions.length === 0 ? (
            <div className="text-sm text-muted-foreground py-10 text-center">No transactions yet.</div>
          ) : (
            <div className="divide-y divide-border">
              {data.recent_transactions.map((t) => (
                <div key={t.id} className="py-3 flex items-center justify-between text-sm" data-testid={`tx-row-${t.id}`}>
                  <div className="flex items-center gap-3">
                    {t.type === "deposit" || t.type === "investment" ? <ArrowDownRight className="w-4 h-4 text-success" /> : <ArrowUpRight className="w-4 h-4 text-accent" />}
                    <div>
                      <div className="capitalize">{t.type}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(t.created_at)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono-fin">{formatMoney(t.amount)}</div>
                    <div className={`text-xs ${t.status === "completed" ? "text-success" : t.status === "pending" ? "text-warning" : "text-destructive"}`}>{t.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-lg p-6" data-testid="allocation-card">
          <h3 className="font-serif text-xl mb-4">Allocation</h3>
          {data.allocation.length === 0 ? (
            <div className="text-sm text-muted-foreground py-10 text-center">No active positions.</div>
          ) : (
            <>
              <div className="h-44">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={data.allocation} dataKey="value" nameKey="name" innerRadius={42} outerRadius={70} paddingAngle={2}>
                      {data.allocation.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => formatMoney(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2 text-xs">
                {data.allocation.map((a, i) => (
                  <div key={a.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} /> {a.name}</span>
                    <span className="font-mono-fin">{formatMoney(a.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
