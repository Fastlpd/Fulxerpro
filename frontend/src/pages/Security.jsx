import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Security() {
  const { user, refresh } = useAuth();
  const [status, setStatus] = useState(null);
  const [setup, setSetup] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = () => api.get("/2fa/status").then((r) => setStatus(r.data));
  useEffect(() => { load(); }, []);

  const startSetup = async () => {
    setError(""); setLoading(true);
    try { const r = await api.post("/2fa/setup"); setSetup(r.data); }
    catch (e) { setError(e.response?.data?.detail || "Setup failed"); }
    finally { setLoading(false); }
  };

  const verify = async () => {
    setError(""); setLoading(true);
    try {
      await api.post("/2fa/verify", { code });
      setSetup(null); setCode(""); await load(); await refresh();
    } catch (e) { setError(e.response?.data?.detail || "Invalid code"); }
    finally { setLoading(false); }
  };

  const disable = async () => {
    setError(""); setLoading(true);
    try { await api.post("/2fa/disable", { code }); setCode(""); await load(); }
    catch (e) { setError(e.response?.data?.detail || "Failed"); }
    finally { setLoading(false); }
  };

  if (!status) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-8 max-w-2xl" data-testid="security-root">
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Account security</div>
        <h1 className="font-serif text-4xl mt-2">Two-factor authentication</h1>
        <p className="text-muted-foreground mt-2">
          {status.required ? "2FA is required for your admin role." : "Optional but strongly recommended."}
        </p>
      </div>

      <div className={`p-5 border rounded-lg flex items-center gap-4 ${status.enabled ? "bg-success/10 border-success/30" : "bg-warning/10 border-warning/30"}`} data-testid="2fa-status">
        <ShieldCheck className={`w-8 h-8 ${status.enabled ? "text-success" : "text-warning"}`} />
        <div>
          <div className="font-medium">2FA: {status.enabled ? "Enabled" : "Not enabled"}</div>
          <div className="text-sm text-muted-foreground">{status.enabled ? "Your account is protected by an authenticator app." : "Add an extra layer of security with Google Authenticator, Authy, or 1Password."}</div>
        </div>
      </div>

      {error && <div className="p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm" data-testid="2fa-error">{error}</div>}

      {!status.enabled && !setup && (
        <button onClick={startSetup} disabled={loading} data-testid="2fa-setup-btn"
          className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />} Enable 2FA
        </button>
      )}

      {setup && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4" data-testid="2fa-setup-card">
          <h3 className="font-serif text-xl">Scan QR with your authenticator app</h3>
          <img src={setup.qr_code} alt="2FA QR" className="w-48 h-48 border border-border" />
          <div className="text-xs text-muted-foreground">Or enter secret manually: <span className="font-mono-fin text-foreground">{setup.secret}</span></div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">6-digit code from your app</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="000000" maxLength={6} data-testid="2fa-verify-code"
              className="mt-2 w-full px-4 py-3 border border-border bg-background rounded-md font-mono-fin focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button onClick={verify} disabled={loading || code.length < 6} data-testid="2fa-verify-btn"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Verify & enable</>}
          </button>
        </div>
      )}

      {status.enabled && !status.required && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-3" data-testid="2fa-disable-card">
          <div className="text-sm">Disable 2FA — confirm with your current code.</div>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="000000" maxLength={6} data-testid="2fa-disable-code"
            className="w-full px-4 py-3 border border-border bg-background rounded-md font-mono-fin" />
          <button onClick={disable} disabled={loading || code.length < 6} data-testid="2fa-disable-btn"
            className="px-4 py-2 text-sm border border-destructive text-destructive rounded-md hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50">
            Disable 2FA
          </button>
        </div>
      )}
    </div>
  );
}
