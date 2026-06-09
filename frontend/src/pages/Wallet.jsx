import React, { useState } from "react";
import { api, formatMoney } from "@/lib/api";
import { ArrowDownRight, ArrowUpRight, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Wallet() {
  const { user, refresh } = useAuth();
  const [tab, setTab] = useState("deposit");
  const [form, setForm] = useState({ amount: "", method: "bank_transfer", reference: "", destination: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const url = tab === "deposit" ? "/transactions/deposit" : "/transactions/withdraw";
      const payload = tab === "deposit"
        ? { amount: parseFloat(form.amount), method: form.method, reference: form.reference || undefined }
        : { amount: parseFloat(form.amount), method: form.method === "card" ? "bank_transfer" : form.method, destination: form.destination };
      await api.post(url, payload);
      setSuccess(tab === "deposit" ? "Deposit request submitted. Pending admin approval." : "Withdrawal submitted for review.");
      setForm({ amount: "", method: "bank_transfer", reference: "", destination: "" });
      await refresh();
    } catch (err) {
      const d = err.response?.data?.detail;
      setError(typeof d === "string" ? d : "Request failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-8 max-w-2xl" data-testid="wallet-root">
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Wallet</div>
        <h1 className="font-serif text-4xl mt-2">Manage funds</h1>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Available balance</div>
        <div className="mt-2 font-mono-fin text-5xl" data-testid="wallet-balance">{formatMoney(user.balance)}</div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="grid grid-cols-2 bg-secondary rounded-md p-1 mb-6">
          <button onClick={() => setTab("deposit")} data-testid="tab-deposit"
            className={`py-2 rounded text-sm font-medium transition ${tab === "deposit" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
            <ArrowDownRight className="w-4 h-4 inline mr-1" /> Deposit
          </button>
          <button onClick={() => setTab("withdraw")} data-testid="tab-withdraw"
            className={`py-2 rounded text-sm font-medium transition ${tab === "withdraw" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
            <ArrowUpRight className="w-4 h-4 inline mr-1" /> Withdraw
          </button>
        </div>

        {success && <div className="mb-4 p-3 bg-success/10 text-success border border-success/30 rounded-md flex items-center gap-2 text-sm" data-testid="wallet-success"><CheckCircle2 className="w-4 h-4" />{success}</div>}
        {error && <div className="mb-4 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm" data-testid="wallet-error">{error}</div>}

        <form onSubmit={submit} className="space-y-4" data-testid="wallet-form">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Amount</span>
            <input type="number" min="10" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
              data-testid="wallet-amount"
              className="mt-2 w-full px-4 py-3 border border-border bg-background rounded-md font-mono-fin focus:outline-none focus:ring-2 focus:ring-ring" />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Method</span>
            <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}
              data-testid="wallet-method"
              className="mt-2 w-full px-4 py-3 border border-border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="bank_transfer">Bank transfer</option>
              <option value="crypto">Crypto</option>
              {tab === "deposit" && <option value="card">Card</option>}
            </select>
          </label>
          {tab === "deposit" ? (
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Reference (optional)</span>
              <input type="text" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })}
                data-testid="wallet-reference"
                className="mt-2 w-full px-4 py-3 border border-border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring" />
            </label>
          ) : (
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Destination (account / wallet)</span>
              <input type="text" required value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })}
                data-testid="wallet-destination"
                className="mt-2 w-full px-4 py-3 border border-border bg-background rounded-md font-mono-fin focus:outline-none focus:ring-2 focus:ring-ring" />
            </label>
          )}
          <button type="submit" disabled={loading} data-testid="wallet-submit"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : tab === "deposit" ? "Submit deposit" : "Request withdrawal"}
          </button>
        </form>
      </div>
    </div>
  );
}
