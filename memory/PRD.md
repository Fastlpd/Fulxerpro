# FulxerPro — Product Requirements Document (PRD)

## Original problem statement
User asked us to act as senior software architect / fintech product strategist / devops / UI/UX / security auditor / refactoring expert and perform full project analysis + 8-phase transformation of the FulxerPro investment platform "connected via GitHub". The actual repository was **not present** in `/app` at session start — only the default Emergent starter scaffold was found. With user direction to "proceed with best judgment", we treated this as a greenfield build of a production-grade FulxerPro platform that delivers the spirit of the 8 phases.

## Architecture (delivered)
- **Backend**: FastAPI 0.110 + motor (async MongoDB). Modular layout: `core/`, `routers/`, `services/`, `models/`. `/api/v1` versioning + legacy `/api` alias.
- **Frontend**: React 19 + CRA + Tailwind + Shadcn primitives + Recharts + lucide-react. Cormorant Garamond + Manrope + JetBrains Mono. Dark/light theme via CSS variables + ThemeContext.
- **DB**: MongoDB collections — `users`, `plans`, `investments`, `transactions`, `kyc_submissions`, `audit_logs`, `login_attempts`, `password_reset_tokens` with proper indexes (unique email, TTL on reset tokens, compound on transactions).

## User personas
1. **Investor (default `role: user`)** — browses plans, deposits, invests, withdraws after KYC, refers friends.
2. **Admin (`role: admin`)** — approves/rejects deposits & withdrawals, reviews KYC, manages plans, monitors audit logs & analytics.
3. **Visitor** — public marketing landing with hero, trust signals, plans teaser.

## Core requirements (static)
- Auth: JWT (httpOnly cookies) + bcrypt + brute-force lockout + rate limit.
- RBAC: `user`, `admin`, `super_admin` enforced server-side.
- Investment workflows with atomic balance debit and ledger entries.
- KYC gate on invest + withdraw.
- Admin approval queue for deposits/withdrawals.
- Referral system (5% commission tree).
- Audit logging on every security & financial event.
- Premium fintech UI with dark/light mode.

## What's been implemented (Jan 2026)
- 2026-01: Full v1 backend with 8 routers (auth, plans, investments, transactions, portfolio, referrals, kyc, admin) — 95% backend test pass.
- 2026-01: Premium landing page + auth pages (login/register) + 7 dashboard pages (Dashboard, Plans, Wallet, Transactions, Referrals, KYC, Admin).
- 2026-01: All deliverable documents written to `/app/docs/01-06`.

## Prioritized backlog (next sprints)
### P1 — Short term
- APScheduler to mature investments daily.
- SendGrid transactional emails (verification, approvals).
- Pagination on admin tables.
- Redis-backed rate limiter & portfolio summary cache.
- Real KYC provider (Sumsub / Persona).
- CSRF tokens + secure cookie flags in prod.
- TOTP 2FA for admin.

### P2 — Medium term
- AI Support Assistant (Claude Sonnet 4.5 via Universal Key).
- Crypto deposits webhook + Stripe card deposits.
- Gamification badges + XP.
- Education center.
- Push notifications.
- PostHog product analytics.

### P3 — Long term
- React Native mobile app.
- Multi-currency + FX engine.
- Sharded MongoDB Atlas + event-sourced ledger.
- SOC 2 Type II path.

## Test credentials
See `/app/memory/test_credentials.md`.

## Open questions for user
- Should we connect the actual FulxerPro GitHub repo for a true refactor diff, or continue evolving this greenfield base?
- Which payment integrations to wire next (Stripe / Crypto / both)?
- Real KYC provider preference?
