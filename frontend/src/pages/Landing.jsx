import React, { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, TrendingUp, Lock, ArrowRight, CheckCircle2, BarChart3, Users, Sparkles,
  Globe, Brain, Activity, Zap, ChevronRight, ArrowUpRight, Building2
} from "lucide-react";

const Scene3D = lazy(() => import("@/components/Scene3D"));

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

// ===== Floating glass card =====
const GlassCard = ({ children, className = "", style }) => (
  <div
    className={`relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] ${className}`}
    style={style}
  >
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
    {children}
  </div>
);

// ===== Mini live chart (SVG sparkline) =====
const Sparkline = ({ color = "#22d3a3", points = [] }) => {
  const pts = points.length ? points : [12, 16, 14, 22, 19, 28, 26, 34, 31, 40, 38, 46];
  const max = Math.max(...pts), min = Math.min(...pts);
  const w = 200, h = 60;
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${(i / (pts.length - 1)) * w},${h - ((p - min) / (max - min)) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-14">
      <defs>
        <linearGradient id={`sp-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${w},${h} L0,${h} Z`} fill={`url(#sp-${color})`} />
      <path d={path} stroke={color} strokeWidth="1.8" fill="none" />
    </svg>
  );
};

export default function Landing() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Ambient gradient background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(194,89,52,0.25),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_20%_60%,rgba(34,211,163,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_80%,rgba(255,176,136,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.4))]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5" data-testid="landing-header">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5" data-testid="landing-logo">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c25934] to-[#ffb088] flex items-center justify-center">
              <span className="font-serif text-lg leading-none text-black">F</span>
            </div>
            <span className="font-serif text-xl tracking-tight">FulxerPro</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#markets" className="hover:text-white transition">Markets</a>
            <a href="#intelligence" className="hover:text-white transition">Intelligence</a>
            <a href="#security" className="hover:text-white transition">Security</a>
            <a href="#plans" className="hover:text-white transition">Plans</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" data-testid="header-login" className="px-4 py-2 text-sm text-white/80 hover:text-white transition">Sign in</Link>
            <Link to="/register" data-testid="header-register"
              className="px-4 py-2 text-sm bg-white text-black rounded-full hover:bg-white/90 transition inline-flex items-center gap-1">
              Open account <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20">
        {/* 3D scene canvas */}
        <div className="absolute inset-0 -z-0">
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-8 items-center w-full">
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="md:col-span-7">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/15 rounded-full backdrop-blur-sm bg-white/5 text-xs uppercase tracking-[0.25em] text-white/70 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22d3a3] shadow-[0_0_8px_#22d3a3]" />
              Live · 47,000 investors · $2.4B AUM
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tight">
              The new<br />
              <span className="bg-gradient-to-r from-[#ffb088] via-[#c25934] to-[#d4a373] bg-clip-text text-transparent italic">institutional</span><br />
              standard.
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-8 text-lg md:text-xl text-white/60 max-w-xl leading-relaxed">
              FulxerPro unifies institutional-grade risk controls, AI-powered allocation,
              and curated yield strategies — engineered for serious capital.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-12 flex flex-wrap gap-3">
              <Link to="/register" data-testid="hero-cta-register"
                className="group inline-flex items-center gap-2 px-7 py-4 bg-white text-black rounded-full hover:bg-white/90 transition font-medium">
                Open an account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
              <a href="#markets" data-testid="hero-cta-plans"
                className="inline-flex items-center gap-2 px-7 py-4 border border-white/20 rounded-full hover:bg-white/5 transition backdrop-blur-sm">
                Explore the platform
              </a>
            </motion.div>
            <motion.div variants={fadeUp} custom={4} className="mt-14 flex flex-wrap items-center gap-8 text-xs text-white/40 uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> SOC2 ready</span>
              <span className="flex items-center gap-2"><Lock className="w-3.5 h-3.5" /> 256-bit encryption</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> KYC / AML</span>
              <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> 47 markets</span>
            </motion.div>
          </motion.div>

          {/* Floating glass dashboard cards (right side) */}
          <div className="md:col-span-5 relative h-[520px] hidden md:block">
            <motion.div
              initial={{ opacity: 0, y: 40, rotateY: -10 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              style={{ transform: `perspective(1000px) translate3d(${mouse.x * -8}px, ${mouse.y * -6}px, 0) rotateY(${mouse.x * -2}deg) rotateX(${mouse.y * 1.5}deg)` }}
            >
              <GlassCard className="p-6 absolute top-4 right-0 w-[320px]" data-testid="hero-card-portfolio">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">Portfolio · Live</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22d3a3] animate-pulse" />
                </div>
                <div className="font-mono text-4xl font-light mt-2 tracking-tight">$2,847,392<span className="text-2xl text-white/40">.18</span></div>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#22d3a3]" />
                  <span className="text-[#22d3a3]">+18.42%</span>
                  <span className="text-white/40">YTD</span>
                </div>
                <div className="mt-4"><Sparkline color="#22d3a3" /></div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wider">
                  {[{l:"Allocation",v:"82%"},{l:"Risk",v:"Bal"},{l:"Plans",v:"4"}].map(s=>(
                    <div key={s.l} className="border-l border-white/10 pl-2">
                      <div className="text-white/40">{s.l}</div>
                      <div className="text-white text-sm font-medium normal-case tracking-normal">{s.v}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ transform: `perspective(1000px) translate3d(${mouse.x * 10}px, ${mouse.y * 8}px, 0)` }}
            >
              <GlassCard className="p-5 absolute top-[230px] left-4 w-[260px]" data-testid="hero-card-ai">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22d3a3]/30 to-[#22d3a3]/10 border border-[#22d3a3]/30 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-[#22d3a3]" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80 font-medium">AI Allocation</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">Sonnet 4.5 · Live</div>
                  </div>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">"Rotate 12% from Growth Index to Alpha Capital — momentum signals confirm Q1 thesis."</p>
                <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-white/40">
                  <span>Confidence 91%</span>
                  <span className="text-[#22d3a3]">Apply →</span>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={{ transform: `perspective(1000px) translate3d(${mouse.x * 14}px, ${mouse.y * 10}px, 0)` }}
            >
              <GlassCard className="p-4 absolute bottom-4 right-10 w-[200px]" data-testid="hero-card-roi">
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">Alpha Capital</div>
                <div className="font-mono text-3xl mt-2 text-[#ffb088]">22.0%</div>
                <div className="text-[10px] text-white/50">ROI · 90 days</div>
                <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#c25934] to-[#ffb088]" style={{ width: "72%" }} />
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40 text-[10px] uppercase tracking-[0.3em]">
          <span>Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ===== LIVE MARKETS STRIP ===== */}
      <section id="markets" className="relative py-24 border-y border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-14 grid md:grid-cols-12 gap-8">
            <div className="md:col-span-5">
              <div className="text-xs uppercase tracking-[0.3em] text-[#ffb088]">01 — Live intelligence</div>
              <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">Markets, decoded in real time.</h2>
            </div>
            <p className="md:col-span-6 md:col-start-7 text-white/60 leading-relaxed self-end">
              Every position is monitored against macro signals, volatility surfaces, and proprietary momentum models. Your dashboard updates the moment markets move.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { l: "S&P 500", v: "5,847.32", d: "+0.84%", c: "#22d3a3", pts: [10,14,12,18,16,22,20,28,26,32,30,36] },
              { l: "BTC / USD", v: "$94,218", d: "+2.31%", c: "#ffb088", pts: [15,12,18,16,22,28,25,32,30,35,38,42] },
              { l: "Gold (oz)", v: "$2,684", d: "+0.42%", c: "#d4a373", pts: [20,18,22,21,24,23,26,25,28,27,30,29] },
              { l: "10Y Yield", v: "4.32%", d: "-0.08%", c: "#ef4444", pts: [30,28,26,24,22,20,22,20,18,20,18,16] },
            ].map((m, i) => (
              <motion.div key={m.l} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}
                data-testid={`market-card-${i}`}
                className="group relative">
                <GlassCard className="p-5 transition-all duration-500 hover:border-white/20 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-white/40">{m.l}</span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.c, boxShadow: `0 0 8px ${m.c}` }} />
                  </div>
                  <div className="font-mono text-2xl mt-3 tracking-tight">{m.v}</div>
                  <div className="text-xs mt-1" style={{ color: m.c }}>{m.d}</div>
                  <div className="mt-3"><Sparkline color={m.c} points={m.pts} /></div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INTELLIGENCE / AI SECTION ===== */}
      <section id="intelligence" className="relative py-32">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="md:col-span-6">
            <div className="text-xs uppercase tracking-[0.3em] text-[#ffb088]">02 — Concierge intelligence</div>
            <h2 className="font-serif text-4xl md:text-6xl mt-4 leading-[1] tracking-tight">
              Your private banker,<br />
              <span className="bg-gradient-to-r from-[#22d3a3] to-[#ffb088] bg-clip-text text-transparent">always on.</span>
            </h2>
            <p className="mt-8 text-white/60 leading-relaxed max-w-lg">
              FulxerPro Concierge — powered by Claude Sonnet 4.5 — knows your portfolio,
              your risk tolerance, and the live market. Ask anything. Get answered in seconds.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 max-w-lg">
              {[
                { i: Brain, l: "AI allocation suggestions" },
                { i: Activity, l: "Real-time portfolio Q&A" },
                { i: Zap, l: "Instant KYC guidance" },
                { i: Globe, l: "47 global markets" },
              ].map((b) => (
                <div key={b.l} className="flex items-center gap-2.5 text-sm text-white/70">
                  <b.i className="w-4 h-4 text-[#22d3a3]" /> {b.l}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mock chat panel */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-6">
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-5 pb-5 border-b border-white/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c25934] to-[#ffb088] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <div>
                  <div className="text-sm font-medium">Concierge</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Claude Sonnet 4.5</div>
                </div>
                <span className="ml-auto text-[10px] text-[#22d3a3] uppercase tracking-wider">● Live</span>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-end"><div className="bg-white/10 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">Best plan for a $25k allocation, 90 days, moderate risk?</div></div>
                <div className="flex justify-start"><div className="bg-gradient-to-br from-[#22d3a3]/15 to-transparent border border-[#22d3a3]/20 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] text-white/90">
                  <span className="text-[#22d3a3] font-medium">Alpha Capital</span> matches — 22% ROI over 90 days, accepting $10k–$100k. Expected return on $25k: <span className="font-mono text-[#ffb088]">$30,500</span>. Shall I queue it?
                </div></div>
                <div className="flex justify-end"><div className="bg-white/10 rounded-2xl rounded-tr-sm px-4 py-2.5">Yes, but cap drawdown at 8%.</div></div>
                <div className="flex justify-start"><div className="bg-gradient-to-br from-[#22d3a3]/15 to-transparent border border-[#22d3a3]/20 rounded-2xl rounded-tl-sm px-4 py-2.5 text-white/90">
                  Stop-loss configured. Position prepared — confirm in dashboard.
                </div></div>
              </div>
              <div className="mt-5 px-4 py-3 bg-white/5 border border-white/10 rounded-full text-sm text-white/40">Ask Concierge anything…</div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ===== PLANS ===== */}
      <section id="plans" className="relative py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="grid md:grid-cols-12 gap-8 mb-16">
            <div className="md:col-span-5">
              <div className="text-xs uppercase tracking-[0.3em] text-[#ffb088]">03 — Investment plans</div>
              <h2 className="font-serif text-4xl md:text-6xl mt-4 leading-[1]">A tier for every<br /><span className="italic">conviction.</span></h2>
            </div>
            <p className="md:col-span-6 md:col-start-7 text-white/60 leading-relaxed self-end">
              From conservative yield to high-conviction alpha — transparent ROI, lock-up clarity, and risk-adjusted positioning baked into every tier.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Starter Yield", roi: "6%", days: 30, risk: "Low", min: "$100", c: "#22d3a3" },
              { name: "Growth Index", roi: "12%", days: 60, risk: "Medium", min: "$1,000", c: "#d4a373" },
              { name: "Alpha Capital", roi: "22%", days: 90, risk: "High", min: "$10,000", c: "#ffb088" },
              { name: "Institutional", roi: "35%", days: 180, risk: "High", min: "$50,000", c: "#c25934" },
            ].map((p, i) => (
              <motion.div key={p.name} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i} data-testid={`landing-plan-${i}`}>
                <GlassCard className="p-6 group h-full transition-all duration-500 hover:border-white/20 hover:-translate-y-2">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">Plan 0{i + 1}</div>
                  <div className="font-serif text-2xl mt-3">{p.name}</div>
                  <div className="mt-6 font-mono text-5xl tracking-tight" style={{ color: p.c, textShadow: `0 0 24px ${p.c}40` }}>{p.roi}</div>
                  <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">{p.days} days</div>
                  <div className="mt-6 pt-4 border-t border-white/10 space-y-1.5 text-xs">
                    <div className="flex justify-between text-white/50"><span>Risk</span><span className="text-white/80">{p.risk}</span></div>
                    <div className="flex justify-between text-white/50"><span>Min</span><span className="text-white/80 font-mono">{p.min}</span></div>
                  </div>
                  <Link to="/register" className="mt-5 flex items-center justify-between text-sm text-white/80 group-hover:text-white transition">
                    <span>Invest now</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </Link>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUST / WHY ===== */}
      <section id="security" className="relative py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-3xl mx-auto mb-20">
            <div className="text-xs uppercase tracking-[0.3em] text-[#ffb088]">04 — Why FulxerPro</div>
            <h2 className="font-serif text-4xl md:text-6xl mt-4 leading-[1]">Engineered for trust.<br /><span className="italic bg-gradient-to-r from-[#22d3a3] to-[#ffb088] bg-clip-text text-transparent">Built for return.</span></h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { i: Shield, t: "Risk-first architecture", d: "Every plan bounded by exposure ceilings, stress-tested against historical drawdowns." },
              { i: Lock, t: "Custodial security", d: "Segregated accounts, multi-signature withdrawals, continuous audit logging." },
              { i: BarChart3, t: "Transparent ROI", d: "Every yield surface visible — no hidden carry, no withdrawal traps." },
              { i: Brain, t: "AI-augmented allocation", d: "Concierge analyzes your positions and surfaces quant-grade suggestions." },
              { i: Users, t: "Concierge advisors", d: "Senior advisors available for accredited tiers. KYC under 24 hours." },
              { i: Building2, t: "Institutional rails", d: "Bank-grade settlement, crypto custody, multi-jurisdiction compliance." },
            ].map((b, i) => (
              <motion.div key={b.t} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <GlassCard className="p-6 h-full transition-all duration-500 hover:border-white/20 hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center mb-5">
                    <b.i className="w-5 h-5 text-[#ffb088]" />
                  </div>
                  <div className="font-serif text-2xl">{b.t}</div>
                  <p className="text-sm text-white/50 mt-3 leading-relaxed">{b.d}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KPI STRIP ===== */}
      <section className="relative py-20 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(194,89,52,0.15),transparent)]" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 relative">
          {[
            { v: "$2.4B+", l: "Assets under management" },
            { v: "47,000+", l: "Active investors" },
            { v: "16.2%", l: "Avg annualized return" },
            { v: "99.99%", l: "Platform uptime" },
          ].map((s, i) => (
            <motion.div key={s.l} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i} className="text-center md:text-left">
              <div className="font-serif text-5xl md:text-6xl bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent" data-testid={`kpi-${i}`}>{s.v}</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-3">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-40 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_50%_50%,rgba(255,176,136,0.2),transparent)]" />
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="relative max-w-3xl mx-auto px-6">
          <div className="text-xs uppercase tracking-[0.3em] text-[#ffb088]">05 — Begin</div>
          <h2 className="font-serif text-5xl md:text-7xl mt-6 leading-[1]">
            Your capital deserves<br /><span className="italic bg-gradient-to-r from-[#22d3a3] via-[#ffb088] to-[#c25934] bg-clip-text text-transparent">an upgrade.</span>
          </h2>
          <p className="text-white/60 mt-8 max-w-xl mx-auto leading-relaxed">
            Open your FulxerPro account in 60 seconds. Verified in under 24 hours. Funded the same day.
          </p>
          <Link to="/register" data-testid="footer-cta-register"
            className="group inline-flex items-center gap-2 mt-12 px-8 py-4 bg-white text-black rounded-full hover:bg-white/90 transition font-medium">
            Open my account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-white/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#c25934] to-[#ffb088] flex items-center justify-center">
              <span className="font-serif text-xs leading-none text-black">F</span>
            </div>
            © {new Date().getFullYear()} FulxerPro Capital. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Disclosures</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
