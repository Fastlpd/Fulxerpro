# FulxerPro — Product Requirements Document (PRD)

## Status: Iteration 3 (Jan 2026)

## Original problem statement
Build a production-grade FulxerPro fintech investment platform with full 8-phase transformation: deep analysis, restructuring, security hardening, investment platform optimization, UI/UX modernization (premium fintech, dark/light, mobile-first, accessibility), performance, deployment, and business growth features. Connected GitHub repo: `https://github.com/Fastlpd/fulxerpro` (cloned + analyzed — frontend-only Vite/TS marketing site, no backend).

## Architecture
- **Backend**: FastAPI 0.110 + motor (MongoDB) — modular: `core/`, `routers/` (auth, plans, investments, transactions, portfolio, referrals, kyc, admin, twofa, concierge), `services/` (audit, rate_limit, email, scheduler, sumsub), `models/`. `/api/v1` + `/api` alias.
- **Frontend**: React 19 + CRA + Tailwind + Shadcn primitives + framer-motion + three.js/r3f + Recharts. Premium dark cinematic landing + organic-earthy light authenticated dashboard. Cormorant Garamond + Manrope + JetBrains Mono.
- **DB**: MongoDB — users, plans, investments, transactions, kyc_submissions, audit_logs, login_attempts, password_reset_tokens, concierge_messages (per-user chat memory).

## What's been implemented (Jan 2026)

### Foundation
- Modular backend, JWT cookie auth + bcrypt + RBAC + brute-force lockout + rate limit
- 4 seeded investment plans + admin user
- Atomic balance debit, ledger entries, audit logging
- /api/v1 versioning + legacy /api alias

### Iteration 1 — Core platform
- Auth (register/login/me/refresh/logout)
- Plans marketplace + invest flow with KYC gate
- Deposit/withdraw with admin approval queue
- KYC submission + admin review
- Referral system (5% commission tree)
- Portfolio summary + admin analytics
- Premium landing + dashboard pages

### Iteration 2 — Integrations
- **Sumsub KYC** scaffolded in sandbox mock mode (token + webhook)
- **AI Investor Concierge** (Claude Sonnet 4.5, streaming SSE, per-user memory, full FulxerPro context — plans, portfolio, balance, KYC status)
- **APScheduler** maturity job (every 10 min — matures investments, credits balance, sends email)
- **SendGrid email** scaffolded with log-to-console fallback (welcome, deposit-approved, withdrawal-approved, investment-matured)
- **2FA TOTP** via pyotp — required for admin, optional for users, with QR code enrollment

### Iteration 3 — Cinematic landing redesign
- **Full dark theme** with subtle gradient backgrounds
- **3D Hero scene** (r3f + three.js): floating asset spheres, candlestick cluster, particle ring, starfield, holographic chart panels
- **Glassmorphism panels**: Portfolio dashboard mock, AI suggestion card, ROI card with parallax mouse-follow
- **Live markets strip** with animated sparklines (S&P 500, BTC, Gold, 10Y Yield)
- **AI Intelligence section** with mock Concierge chat preview
- **Plans grid** with glowing ROI numbers and risk badges
- **Trust signals** with 6-card glass grid
- **KPI strip** with gradient numbers
- **Cinematic CTA** with multi-stop gradient text
- Framer-motion scroll-triggered fade-ups throughout
- Mouse-follow parallax on hero glass cards

## Test credentials
- Admin: `admin@fulxerpro.com` / `Admin@12345` (2FA required on first login — set up at `/app/security`)
- See `/app/memory/test_credentials.md`

## Deliverable Documents
- `/app/docs/00-repository-deep-analysis.md` — actual repo analysis
- `/app/docs/01-architecture-report.md`
- `/app/docs/02-security-audit.md`
- `/app/docs/03-technical-debt.md`
- `/app/docs/04-priority-roadmap.md`
- `/app/docs/05-deployment-plan.md`
- `/app/docs/06-implementation-checklist.md`
- `/app/docs/diff-impact-analysis.md` — repo migration mapping

## Backlog (P1 — next sprint)
- Pagination on admin tables
- Redis-backed rate limiter + portfolio cache
- Real Sumsub live mode (replace mock)
- Production cookies (`secure=true`, `samesite=strict`)
- CSRF double-submit cookie
- Code-splitting / lazy load per route (Landing already lazy-loads Scene3D)

## Backlog (P2 — medium)
- Crypto deposits (Coinbase Commerce webhook)
- Stripe card deposits (test key in pod env)
- Gamification badges + XP
- Education center
- Push notifications (FCM)
- PostHog product analytics
- Multi-currency / FX

## Open questions for user
- When ready, provide Sumsub `SUMSUB_APP_TOKEN` + `SUMSUB_SECRET_KEY` to flip from mock → live (already coded).
- Provide SendGrid API key + verified sender to flip emails from log-only → live.
- Approve push to GitHub branch `production-overhaul` (via Save to GitHub button)?
