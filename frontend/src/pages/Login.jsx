import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api, formatApiErrorDetail } from "@/lib/api";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";

export default function Login() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [needsTotp, setNeedsTotp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const body = { email, password };
      if (totpCode) body.totp_code = totpCode;
      await api.post("/auth/login", body);
      await refresh();
      const to = location.state?.from || "/app/dashboard";
      navigate(to, { replace: true });
    } catch (e) {
      const detail = formatApiErrorDetail(e.response?.data?.detail);
      if (typeof detail === "string" && /2fa code required/i.test(detail)) {
        setNeedsTotp(true);
        setError("Enter the 6-digit code from your authenticator app.");
      } else {
        setError(detail || "Login failed");
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      <div className="hidden md:flex flex-col justify-between bg-primary text-primary-foreground p-10 relative overflow-hidden">
        <Link to="/" className="font-serif text-2xl" data-testid="login-logo">FulxerPro</Link>
        <div>
          <div className="text-xs uppercase tracking-[0.25em] opacity-70">Welcome back</div>
          <h1 className="font-serif text-5xl mt-4 leading-tight">Your portfolio<br />awaits.</h1>
          <p className="mt-6 opacity-80 max-w-md leading-relaxed">Sign in to manage active positions, review yield, and access your investor dashboard.</p>
        </div>
        <div className="text-xs opacity-60">Audit-ready · 256-bit encryption · KYC compliant</div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <form onSubmit={onSubmit} className="w-full max-w-sm" data-testid="login-form">
          <div className="md:hidden mb-8"><Link to="/" className="font-serif text-2xl">FulxerPro</Link></div>
          <h2 className="font-serif text-3xl">Sign in</h2>
          <p className="text-sm text-muted-foreground mt-1">Enter your credentials to continue.</p>

          {error && (
            <div className={`mt-6 p-3 text-sm border rounded-md ${needsTotp ? "bg-warning/10 text-foreground border-warning/40" : "bg-destructive/10 text-destructive border-destructive/20"}`} data-testid="login-error">
              {needsTotp && <ShieldCheck className="w-4 h-4 inline mr-1 mb-0.5" />}{error}
            </div>
          )}

          <label className="block mt-6">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} data-testid="login-email"
              className="mt-2 w-full px-4 py-3 border border-border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring" />
          </label>
          <label className="block mt-4">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Password</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} data-testid="login-password"
              className="mt-2 w-full px-4 py-3 border border-border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring" />
          </label>

          {needsTotp && (
            <label className="block mt-4">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Authenticator code</span>
              <input type="text" inputMode="numeric" maxLength={6} required value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))} data-testid="login-totp"
                placeholder="000000" autoFocus
                className="mt-2 w-full px-4 py-3 border border-border bg-background rounded-md font-mono-fin tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-ring" />
            </label>
          )}

          <button type="submit" disabled={loading} data-testid="login-submit"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition group">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign in <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" /></>}
          </button>

          <p className="text-sm text-center mt-6 text-muted-foreground">
            No account? <Link to="/register" data-testid="link-register" className="text-accent hover:underline">Open one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
