import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Loader2 } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", password: "", referred_by: sp.get("ref") || "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const payload = { ...form };
    if (!payload.referred_by) delete payload.referred_by;
    const res = await register(payload);
    setLoading(false);
    if (res.ok) navigate("/app/dashboard", { replace: true });
    else setError(res.error || "Registration failed");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      <div className="hidden md:flex flex-col justify-between bg-primary text-primary-foreground p-10">
        <Link to="/" className="font-serif text-2xl" data-testid="register-logo">FulxerPro</Link>
        <div>
          <div className="text-xs uppercase tracking-[0.25em] opacity-70">Open an account</div>
          <h1 className="font-serif text-5xl mt-4 leading-tight">Capital, refined.<br />Returns, engineered.</h1>
          <p className="mt-6 opacity-80 max-w-md leading-relaxed">Join 47,000+ investors compounding through institutional-grade strategies.</p>
        </div>
        <div className="text-xs opacity-60">No setup fees · Cancel any active plan after maturity</div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <form onSubmit={onSubmit} className="w-full max-w-sm" data-testid="register-form">
          <div className="md:hidden mb-8"><Link to="/" className="font-serif text-2xl">FulxerPro</Link></div>
          <h2 className="font-serif text-3xl">Create your account</h2>
          <p className="text-sm text-muted-foreground mt-1">Fully verified investor access in 24 hours.</p>

          {error && <div className="mt-6 p-3 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-md" data-testid="register-error">{error}</div>}

          {[
            { k: "name", l: "Full name", t: "text" },
            { k: "email", l: "Email", t: "email" },
            { k: "password", l: "Password (min 8)", t: "password" },
            { k: "referred_by", l: "Referral code (optional)", t: "text" },
          ].map((f) => (
            <label key={f.k} className="block mt-4">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{f.l}</span>
              <input type={f.t} required={f.k !== "referred_by"} value={form[f.k]} onChange={onChange(f.k)} data-testid={`register-${f.k}`}
                className="mt-2 w-full px-4 py-3 border border-border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring" />
            </label>
          ))}

          <button type="submit" disabled={loading} data-testid="register-submit"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition group">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Open account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" /></>}
          </button>

          <p className="text-sm text-center mt-6 text-muted-foreground">
            Already registered? <Link to="/login" data-testid="link-login" className="text-accent hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
