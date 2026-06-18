import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, TrendingUp, Lock, ArrowRight, CheckCircle2, BarChart3, Users,
  Star, Car, Home, Building2, Sparkles,
} from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1596716999716-544f09b06743?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBnbGFzcyUyMG9mZmljZSUyMGJ1aWxkaW5nJTIwZ29sZGVuJTIwaG91cnxlbnwwfHx8fDE3ODA5OTY2MDJ8MA&ixlib=rb-4.1.0&q=85";

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cars = [
  { name: "Bentley Continental GT", description: "British luxury and performance — a timeless investment.", price: "$250,000", img: "https://images.unsplash.com/photo-1570356528259-a4473e7d383a?q=80&w=2070&auto=format&fit=crop" },
  { name: "Ferrari F8 Tributo", description: "The pinnacle of Italian engineering. Own a piece of motorsport history.", price: "$350,000", img: "https://images.unsplash.com/photo-1612764049760-06ac41d20f6d?q=80&w=1974&auto=format&fit=crop" },
  { name: "Mercedes-Benz S-Class", description: "The benchmark for luxury sedans. A sound investment in technology.", price: "$180,000", img: "https://images.unsplash.com/photo-1599533355422-a398b15878d0?q=80&w=2070&auto=format&fit=crop" },
];

const properties = [
  { name: "Modern Villa, California", architecture: "Sleek, minimalist design with open-concept floor plan and floor-to-ceiling windows.", price: "$2,500,000", img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop" },
  { name: "Urban Loft, New York", architecture: "Industrial-chic with exposed brick, high ceilings, and large factory windows.", price: "$1,200,000", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1974&auto=format&fit=crop" },
  { name: "Suburban Family Home, Texas", architecture: "Classic American craftsman style with a welcoming porch and spacious backyard.", price: "$750,000", img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop" },
];

const reviews = [
  { name: "Sarah L.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2070&auto=format&fit=crop", quote: "The crypto trading tools are top-notch. I've executed both long and short-term strategies with ease. Intuitive and powerful.", highlight: "Crypto Trading" },
  { name: "John D.", avatar: "https://images.unsplash.com/photo-1507003211169-e695c6ede616?q=80&w=1974&auto=format&fit=crop", quote: "Using FulxerPro as a payment holder for car deals has been a game-changer. Secure, transparent, and my clients love it.", highlight: "Car Deal Escrow" },
  { name: "Emily R.", avatar: "https://images.unsplash.com/photo-1508214751196-cdfd4628d084?q=80&w=2070&auto=format&fit=crop", quote: "I've diversified my portfolio with their housing estate investments. Properties are well-vetted, returns are fantastic.", highlight: "Housing Estates" },
  { name: "Michael B.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop", quote: "The stock exchange interface is so smooth. I buy and sell with confidence, and real-time data helps me make decisions.", highlight: "Stock Exchange" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border" data-testid="landing-header">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl tracking-tight" data-testid="landing-logo">FulxerPro</Link>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-accent transition">Features</a>
            <a href="#plans" className="hover:text-accent transition">Plans</a>
            <a href="#cars" className="hover:text-accent transition">Cars</a>
            <a href="#real-estate" className="hover:text-accent transition">Real Estate</a>
            <a href="#reviews" className="hover:text-accent transition">Reviews</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" data-testid="header-login" className="px-4 py-2 text-sm hover:text-accent transition">Sign in</Link>
            <Link to="/register" data-testid="header-register" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition">Open account</Link>
          </div>
        </div>
      </header>

      {/* Hero — ported copy "Unlock Wealth Growth with Secure, Innovative Investments" */}
      <section className="relative overflow-hidden" id="hero">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        </div>
        <motion.div
          variants={stagger} initial="hidden" animate="visible"
          className="relative max-w-7xl mx-auto px-6 py-24 md:py-40 grid md:grid-cols-12 gap-12 items-center"
        >
          <div className="md:col-span-8">
            <motion.div variants={fade} className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-full text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Institutional-grade investing
            </motion.div>
            <motion.h1 variants={fade} className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight">
              Unlock wealth growth with<br />
              <span className="text-accent italic">secure, innovative investments.</span>
            </motion.h1>
            <motion.p variants={fade} className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Join thousands earning seamlessly with FulxerPro. We provide the tools, expertise, and
              custodial discipline to help you navigate the future of finance with confidence.
            </motion.p>
            <motion.div variants={fade} className="mt-10 flex flex-wrap gap-3">
              <Link to="/register" data-testid="hero-cta-register" className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition group">
                Create account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
              <a href="#features" data-testid="hero-cta-learn" className="inline-flex items-center gap-2 px-6 py-3.5 border border-border rounded-md hover:bg-secondary transition">
                Learn more
              </a>
            </motion.div>
            <motion.div variants={fade} className="mt-12 flex flex-wrap items-center gap-8 text-xs text-muted-foreground uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Audit-ready</span>
              <span className="flex items-center gap-2"><Lock className="w-3.5 h-3.5" /> 256-bit encryption</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> KYC / AML</span>
            </motion.div>
          </div>
        </motion.div>
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

      {/* Features — ported from your repo (rebranded from "Argentum" to FulxerPro) */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-accent">01 — Features</div>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">Why choose FulxerPro</h2>
          <p className="text-muted-foreground mt-6">Six engineered pillars that make every dollar work harder, smarter, and safer.</p>
        </motion.div>
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            { i: TrendingUp, t: "Real-time analytics", d: "Stay ahead of the market with up-to-the-second data and powerful institutional insights." },
            { i: Lock, t: "Bank-grade security", d: "Your investments and data are protected with world-class custodial protocols and continuous audit logging." },
            { i: BarChart3, t: "Customizable dashboards", d: "Tailor your workspace to focus on the metrics, markets, and assets that matter most to you." },
            { i: Shield, t: "Risk-first architecture", d: "Every plan is bounded by exposure ceilings and stress-tested against historical drawdowns." },
            { i: Users, t: "Concierge support", d: "Senior advisors for accredited tiers. KYC and onboarding completed in under 24 hours." },
            { i: Sparkles, t: "AI-assisted insights", d: "Portfolio rebalancing suggestions and conversational guidance powered by Claude Sonnet 4.5." },
          ].map(({ i: Icon, t, d }) => (
            <motion.div key={t} variants={fade} className="bg-card border border-border rounded-lg p-8 elev-hover" data-testid={`feature-${t.replace(/\s+/g, "-").toLowerCase()}`}>
              <Icon className="w-6 h-6 text-accent" />
              <div className="font-serif text-2xl mt-5">{t}</div>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Plans teaser */}
      <section id="plans" className="bg-secondary/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-12 gap-8 mb-12">
            <div className="md:col-span-5">
              <div className="text-xs uppercase tracking-[0.25em] text-accent">02 — Investment plans</div>
              <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">A tier for every conviction.</h2>
            </div>
            <p className="md:col-span-6 md:col-start-7 text-muted-foreground leading-relaxed self-end">
              Four tiers spanning conservative yield to high-conviction alpha. Transparent ROI, lock-up clarity, and risk-adjusted positioning.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Starter Yield", roi: "6%", days: 30, risk: "Low" },
              { name: "Growth Index", roi: "12%", days: 60, risk: "Medium" },
              { name: "Alpha Capital", roi: "22%", days: 90, risk: "High" },
              { name: "Institutional Reserve", roi: "35%", days: 180, risk: "High" },
            ].map((p, i) => (
              <motion.div
                key={p.name} data-testid={`landing-plan-${i}`}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="elev-hover bg-card border border-border rounded-lg p-6"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Plan 0{i + 1}</div>
                <div className="font-serif text-2xl mt-3">{p.name}</div>
                <div className="mt-6 font-mono-fin text-4xl text-accent">{p.roi}</div>
                <div className="text-xs text-muted-foreground mt-1">ROI · {p.days} days</div>
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{p.risk} risk</span>
                  <Link to="/register" className="text-accent hover:underline">Invest →</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Car Investments — ported */}
      <section id="cars" className="max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-accent flex items-center justify-center gap-2"><Car className="w-3.5 h-3.5" /> 03 — Automotive investments</div>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">Drive your capital forward.</h2>
          <p className="text-muted-foreground mt-6">Fractional ownership in a curated collection of luxury and high-performance vehicles.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((c, i) => (
            <motion.div key={c.name} data-testid={`car-${i}`}
              initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              className="bg-card rounded-lg overflow-hidden border border-border elev-hover flex flex-col">
              <div className="relative">
                <img src={c.img} alt={c.name} className="h-56 w-full object-cover" loading="lazy" />
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-sm font-mono-fin px-3 py-1.5 rounded">{c.price}</div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-serif text-xl">{c.name}</h3>
                <p className="text-sm text-muted-foreground mt-2 flex-1 leading-relaxed">{c.description}</p>
                <Link to="/register" className="mt-5 inline-flex justify-center items-center gap-2 py-2.5 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition text-sm">Invest now <ArrowRight className="w-3.5 h-3.5" /></Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Housing Investments — ported */}
      <section id="real-estate" className="bg-secondary/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs uppercase tracking-[0.25em] text-accent flex items-center justify-center gap-2"><Home className="w-3.5 h-3.5" /> 04 — Real estate investments</div>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">Build your foundation in property.</h2>
            <p className="text-muted-foreground mt-6">A diversified portfolio of vetted residential and commercial properties with high growth potential.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p, i) => (
              <motion.div key={p.name} data-testid={`property-${i}`}
                initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                className="bg-card rounded-lg overflow-hidden border border-border elev-hover flex flex-col">
                <div className="relative">
                  <img src={p.img} alt={p.name} className="h-56 w-full object-cover" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
                    <h3 className="font-serif text-xl text-white">{p.name}</h3>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground flex-1 leading-relaxed"><span className="font-medium text-foreground">Architecture:</span> {p.architecture}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-mono-fin text-2xl text-accent">{p.price}</span>
                    <Link to="/register" className="py-2 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm">Invest</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews — ported */}
      <section id="reviews" className="max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-accent">05 — What our investors say</div>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">Trusted by investors worldwide.</h2>
          <p className="text-muted-foreground mt-6">Hear from a community of investors who chose FulxerPro to achieve their financial goals.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((r, i) => (
            <motion.div key={r.name} data-testid={`review-${i}`}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 100 }}
              className="bg-card border border-border rounded-lg p-6 flex flex-col elev-hover">
              <div className="flex items-center gap-3 mb-4">
                <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-accent" loading="lazy" />
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-accent">{r.highlight}</div>
                </div>
              </div>
              <blockquote className="text-sm text-muted-foreground leading-relaxed flex-1">"{r.quote}"</blockquote>
              <div className="mt-4 flex gap-0.5">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-warning text-warning" />)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="text-xs uppercase tracking-[0.25em] opacity-70">06 — Begin</div>
          <h2 className="font-serif text-4xl md:text-6xl mt-4 leading-tight">Your capital deserves an upgrade.</h2>
          <p className="opacity-80 mt-6 max-w-xl mx-auto">
            Open your FulxerPro account today. Verified in under 24 hours, funded the same day.
          </p>
          <Link to="/register" data-testid="footer-cta-register" className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition group">
            Open my account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>
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
