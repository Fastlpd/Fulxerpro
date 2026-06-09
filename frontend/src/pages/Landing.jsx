import React from "react";
import { Link } from "react-router-dom";
import { Shield, TrendingUp, Lock, ArrowRight, CheckCircle2, BarChart3, Users, Sparkles } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1596716999716-544f09b06743?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBnbGFzcyUyMG9mZmljZSUyMGJ1aWxkaW5nJTIwZ29sZGVuJTIwaG91cnxlbnwwfHx8fDE3ODA5OTY2MDJ8MA&ixlib=rb-4.1.0&q=85";

const PORTRAIT = "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwzfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDB8fHx8MTc4MDk5NjYwMnww&ixlib=rb-4.1.0&q=85";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border" data-testid="landing-header">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl tracking-tight" data-testid="landing-logo">FulxerPro</Link>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#plans" className="hover:text-accent transition">Plans</a>
            <a href="#why" className="hover:text-accent transition">Why FulxerPro</a>
            <a href="#security" className="hover:text-accent transition">Security</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" data-testid="header-login" className="px-4 py-2 text-sm hover:text-accent transition">Sign in</Link>
            <Link to="/register" data-testid="header-register" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition">Open account</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-40 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-full text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Institutional-grade investing
            </div>
            <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight">
              Capital, refined.<br />
              <span className="text-accent italic">Returns, engineered.</span>
            </h1>
            <p className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed">
              FulxerPro is a private investment platform pairing rigorous risk controls
              with curated yield strategies — designed for investors who value clarity,
              compliance, and conviction.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/register" data-testid="hero-cta-register" className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition group">
                Open an account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
              <a href="#plans" data-testid="hero-cta-plans" className="inline-flex items-center gap-2 px-6 py-3.5 border border-border rounded-md hover:bg-secondary transition">
                Explore plans
              </a>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-8 text-xs text-muted-foreground uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Audit-ready</span>
              <span className="flex items-center gap-2"><Lock className="w-3.5 h-3.5" /> 256-bit encryption</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> KYC / AML</span>
            </div>
          </div>
        </div>
      </section>

      {/* KPI strip */}
      <section className="border-y border-border bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: "$2.4B+", l: "Assets under management" },
            { v: "47,000+", l: "Active investors" },
            { v: "16.2%", l: "Avg annualized return" },
            { v: "99.99%", l: "Platform uptime" },
          ].map((s) => (
            <div key={s.l} className="text-center md:text-left">
              <div className="font-serif text-4xl md:text-5xl text-primary" data-testid={`kpi-${s.l.replace(/\s+/g, "-")}`}>{s.v}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Plans teaser */}
      <section id="plans" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-12 gap-8 mb-12">
          <div className="md:col-span-5">
            <div className="text-xs uppercase tracking-[0.25em] text-accent">02 — Investment plans</div>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">A tier for every conviction.</h2>
          </div>
          <p className="md:col-span-6 md:col-start-7 text-muted-foreground leading-relaxed self-end">
            Four tiers spanning conservative yield to high-conviction alpha. Each plan
            includes transparent ROI, lock-up clarity, and risk-adjusted positioning.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Starter Yield", roi: "6%", days: 30, risk: "Low" },
            { name: "Growth Index", roi: "12%", days: 60, risk: "Medium" },
            { name: "Alpha Capital", roi: "22%", days: 90, risk: "High" },
            { name: "Institutional Reserve", roi: "35%", days: 180, risk: "High" },
          ].map((p, i) => (
            <div key={p.name} data-testid={`landing-plan-${i}`} className="elev-hover bg-card border border-border rounded-lg p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Plan 0{i + 1}</div>
              <div className="font-serif text-2xl mt-3">{p.name}</div>
              <div className="mt-6 font-mono-fin text-4xl text-accent">{p.roi}</div>
              <div className="text-xs text-muted-foreground mt-1">ROI · {p.days} days</div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{p.risk} risk</span>
                <Link to="/register" className="text-accent hover:underline">Invest →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section id="why" className="bg-secondary/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="text-xs uppercase tracking-[0.25em] text-accent">03 — Why FulxerPro</div>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">Engineered for trust. Built for return.</h2>
            <img src={PORTRAIT} alt="" className="mt-10 rounded-lg w-full max-w-md object-cover aspect-[4/5]" />
          </div>
          <div className="md:col-span-7 grid sm:grid-cols-2 gap-6 content-start">
            {[
              { i: Shield, t: "Risk-first architecture", d: "Every plan is bounded by exposure ceilings and stress-tested against historical drawdowns." },
              { i: Lock, t: "Custodial security", d: "Segregated accounts, multi-signature withdrawals, and continuous audit logging." },
              { i: BarChart3, t: "Transparent ROI", d: "Every yield surface is visible — no hidden carry, no withdrawal traps, no surprises." },
              { i: Users, t: "Concierge support", d: "Senior advisors available for accredited tiers. KYC and onboarding in under 24 hours." },
              { i: TrendingUp, t: "Compounding by design", d: "Auto-reinvest, scheduled drips, and dollar-cost averaging built into every plan." },
              { i: Sparkles, t: "AI-assisted insights", d: "Portfolio rebalancing suggestions powered by quantitative models." },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="bg-card border border-border rounded-lg p-6">
                <Icon className="w-5 h-5 text-accent" />
                <div className="font-serif text-xl mt-4">{t}</div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="security" className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="text-xs uppercase tracking-[0.25em] text-accent">04 — Begin</div>
        <h2 className="font-serif text-4xl md:text-6xl mt-4 leading-tight">Your capital deserves an upgrade.</h2>
        <p className="text-muted-foreground mt-6 max-w-xl mx-auto">
          Open your FulxerPro account today. Verified in under 24 hours, funded the same day.
        </p>
        <Link to="/register" data-testid="footer-cta-register" className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition group">
          Open my account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </Link>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} FulxerPro Capital. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Disclosures</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
