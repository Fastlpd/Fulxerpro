import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Shield, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";

const STATUS_UI = {
  verified: { icon: CheckCircle2, color: "text-success", label: "Verified", bg: "bg-success/10 border-success/30" },
  pending: { icon: Clock, color: "text-warning", label: "Under review", bg: "bg-warning/10 border-warning/30" },
  rejected: { icon: AlertCircle, color: "text-destructive", label: "Rejected", bg: "bg-destructive/10 border-destructive/30" },
  unverified: { icon: Shield, color: "text-muted-foreground", label: "Not started", bg: "bg-secondary border-border" },
};

export default function KYC() {
  const { user, refresh } = useAuth();
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({ full_legal_name: "", date_of_birth: "", country: "", document_type: "passport", document_number: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { api.get("/kyc/status").then((r) => setStatus(r.data)); }, []);

  const submit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      await api.post("/kyc/submit", form);
      await refresh();
      const r = await api.get("/kyc/status"); setStatus(r.data);
    } catch (err) {
      const d = err.response?.data?.detail;
      setError(typeof d === "string" ? d : "Submission failed");
    } finally { setLoading(false); }
  };

  if (!status) return <div className="text-muted-foreground">Loading…</div>;
  const ui = STATUS_UI[status.status] || STATUS_UI.unverified;
  const Icon = ui.icon;
  const canSubmit = status.status === "unverified" || status.status === "rejected";

  return (
    <div className="space-y-8 max-w-2xl" data-testid="kyc-root">
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Compliance</div>
        <h1 className="font-serif text-4xl mt-2">Identity verification</h1>
      </div>

      <div className={`p-5 border rounded-lg flex items-center gap-4 ${ui.bg}`} data-testid="kyc-status-card">
        <Icon className={`w-8 h-8 ${ui.color}`} />
        <div>
          <div className="font-medium">Status: {ui.label}</div>
          <div className="text-sm text-muted-foreground">
            {status.status === "unverified" && "Submit your details below to begin verification."}
            {status.status === "pending" && "We're reviewing your documents — typically completes within 24 hours."}
            {status.status === "verified" && "Your account is verified. You can now invest and withdraw."}
            {status.status === "rejected" && "Your previous submission was rejected. Please resubmit with correct details."}
          </div>
        </div>
      </div>

      {canSubmit && (
        <form onSubmit={submit} className="bg-card border border-border rounded-lg p-6 space-y-4" data-testid="kyc-form">
          {error && <div className="p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm" data-testid="kyc-error">{error}</div>}
          {[
            { k: "full_legal_name", l: "Full legal name", t: "text" },
            { k: "date_of_birth", l: "Date of birth", t: "date" },
            { k: "country", l: "Country", t: "text" },
            { k: "document_number", l: "Document number", t: "text" },
            { k: "address", l: "Residential address", t: "text" },
          ].map((f) => (
            <label key={f.k} className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{f.l}</span>
              <input type={f.t} required value={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} data-testid={`kyc-${f.k}`}
                className="mt-2 w-full px-4 py-3 border border-border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring" />
            </label>
          ))}
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Document type</span>
            <select value={form.document_type} onChange={(e) => setForm({ ...form, document_type: e.target.value })} data-testid="kyc-document_type"
              className="mt-2 w-full px-4 py-3 border border-border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="passport">Passport</option>
              <option value="drivers_license">Driver's License</option>
              <option value="national_id">National ID</option>
            </select>
          </label>
          <button type="submit" disabled={loading} data-testid="kyc-submit"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit for verification"}
          </button>
          <p className="text-xs text-muted-foreground">Your data is encrypted and used solely for KYC/AML compliance.</p>
        </form>
      )}
    </div>
  );
}
