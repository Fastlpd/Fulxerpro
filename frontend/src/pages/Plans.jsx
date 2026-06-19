import React, { useEffect, useState } from "react";
import { api, formatMoney } from "@/lib/api";
import { TrendingUp, Loader2, X, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const riskBadge = (r) => ({
  low: "bg-success/15 text-success border-success/30",
  medium: "bg-warning/15 text-warning border-warning/30",
  high: "bg-destructive/15 text-destructive border-destructive/30",
}[r] || "");

export default function Plans() {
  const { user, refresh } = useAuth();
  const [plans, setPlans] = useState([]);
  const [investing, setInvesting] = useState(null);   // selected plan
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { api.get("/plans").then((r) => setPlans(r.data)); }, []);

  const submit = async () => {
    setError(""); setSuccess(""); setSubmitting(true);
    try {
      await api.post("/investments", { plan_id: investing.id, amount: parseFloat(amount) });
      setSuccess(`Successfully invested ${formatMoney(amount)} in ${investing.name}`);
      setInvesting(null); setAmount("");
      await refresh();
    } catch (e) {
      const d = e.response?.data?.detail;
      setError(typeof d === "string" ? d : "Investment failed");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-8" data-testid="plans-root">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Marketplace</div>
          <h1 className="font-serif text-4xl mt-2">Investment plans</h1>
        </div>
        <div className="text-sm text-muted-foreground">Balance: <span className="font-mono-fin text-foreground">{formatMoney(user.balance)}</span></div>
      </div>

      {success && <div className="p-3 bg-success/10 text-success border border-success/30 rounded-md flex items-center gap-2" data-testid="plan-success"><CheckCircle2 className="w-4 h-4" /> {success}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-lg p-6 elev-hover flex flex-col" data-testid={`plan-card-${p.id}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-serif text-2xl">{p.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{p.description}</div>
              </div>
              <span className={`px-2 py-0.5 border rounded text-[10px] uppercase tracking-wider ${riskBadge(p.risk_level)}`}>{p.risk_level}</span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div><div className="text-xs text-muted-foreground uppercase tracking-wider">ROI</div><div className="font-mono-fin text-2xl text-accent">{p.roi_percent}%</div></div>
              <div><div className="text-xs text-muted-foreground uppercase tracking-wider">Duration</div><div className="font-mono-fin text-2xl">{p.duration_days}d</div></div>
              <div><div className="text-xs text-muted-foreground uppercase tracking-wider">Min</div><div className="font-mono-fin">{formatMoney(p.min_amount)}</div></div>
              <div><div className="text-xs text-muted-foreground uppercase tracking-wider">Max</div><div className="font-mono-fin">{formatMoney(p.max_amount)}</div></div>
            </div>
            <button onClick={() => { setInvesting(p); setAmount(String(p.min_amount)); setError(""); }} data-testid={`invest-btn-${p.id}`}
              className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition">
              <TrendingUp className="w-4 h-4" /> Invest
            </button>
          </div>
        ))}
      </div>

      {investing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" data-testid="invest-modal">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-2xl">Invest in {investing.name}</h3>
              <button onClick={() => setInvesting(null)} data-testid="modal-close"><X className="w-5 h-5" /></button>
            </div>
            <div className="text-sm text-muted-foreground">Earn <span className="text-accent font-mono-fin">{investing.roi_percent}%</span> over {investing.duration_days} days.</div>
            {error && <div className="mt-4 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm" data-testid="invest-error">{error}</div>}
            <label className="block mt-4">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Amount</span>
              <input type="number" min={investing.min_amount} max={investing.max_amount} value={amount} onChange={(e) => setAmount(e.target.value)} data-testid="invest-amount"
                className="mt-2 w-full px-4 py-3 border border-border bg-background rounded-md font-mono-fin focus:outline-none focus:ring-2 focus:ring-ring" />
              <div className="text-xs text-muted-foreground mt-1">Min {formatMoney(investing.min_amount)} · Max {formatMoney(investing.max_amount)}</div>
            </label>
            <div className="mt-4 p-3 bg-secondary rounded-md text-sm flex justify-between">
              <span>Expected return at maturity</span>
              <span className="font-mono-fin text-accent">{formatMoney(parseFloat(amount || 0) * (1 + investing.roi_percent / 100))}</span>
            </div>
            <button onClick={submit} disabled={submitting} data-testid="confirm-invest"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm investment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
