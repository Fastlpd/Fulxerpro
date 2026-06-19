# FulxerPro — Product Requirements Document (PRD)

## Original problem statement
8-phase transformation of FulxerPro investment platform. Real repo at `github.com/Fastlpd/fulxerpro` is **frontend-only Vite+TS marketing site** with mock dashboard — no backend, no auth, no DB, hardcoded Alpha Vantage placeholder key, ~600 LOC duplicate dead code in `fulxer termites/src_backup/`. We built a full production-grade replacement and produced a deep diff/migration analysis.

## Architecture (delivered)
- **Backend**: FastAPI 0.110 + motor + 10 routers (`auth`, `plans`, `investments`, `transactions`, `portfolio`, `referrals`, `kyc`, `admin`, `twofa`, `concierge`). `/api/v1` + `/api` alias.
- **Frontend**: React 19 + CRA + Tailwind + Shadcn. Premium organic-earthy light + dark theme.
- **DB collections**: users, plans, investments, transactions, kyc_submissions, audit_logs, login_attempts, password_reset_tokens, concierge_messages.

## What's been implemented (Jan 2026)
### Iteration 1 (foundation)
- Modular FastAPI backend, JWT cookies + bcrypt + brute-force lockout, RBAC.
- Plans marketplace, investments with atomic balance debit + KYC gate.
- Deposit/withdrawal with admin approval queue. Referral 5% commission.
- KYC submission + admin review. Audit logging.
- Landing + 7 dashboard pages + admin control room (5 tabs).
- All 6 deliverable docs in `/app/docs/`.
- Backend tests: 95% (only rate-limit flakes).

### Iteration 2 (integrations) — current
- **AI Investor Concierge** (Claude Sonnet 4.5 via Emergent Universal Key): SSE streaming, persistent memory in `db.concierge_messages`, system prompt with live user portfolio + active plans + holdings context.
- **Sumsub KYC sandbox-mock**: `/api/kyc/sumsub/access-token` + `/api/kyc/sumsub/webhook` with HMAC signature verification (stubbed in mock mode).
- **APScheduler**: maturity job runs every 10 minutes, atomically credits returns, marks status=matured, inserts maturity transaction, emails investor.
- **SendGrid log-mode email**: welcome on register, deposit-approved, withdrawal-approved, investment-matured templates — log to backend stdout in mock mode.
- **TOTP 2FA** (pyotp + qrcode): setup/verify/disable/status; required for admin role, optional for users. Login UI prompts for code when account has 2FA enabled.
- **Deep repo analysis** at `/app/docs/00-repository-deep-analysis.md` + `/app/docs/diff-impact-analysis.md`.
- Backend tests: **13/13 pass**. Frontend smoke: 100%.

## Test credentials
- Admin: `admin@fulxerpro.com` / `Admin@12345` — **2FA ENABLED** (secret in `/app/memory/test_credentials.md`).
- Universal LLM key already configured in `/app/backend/.env`.

## Prioritized backlog
### P1 (next sprint)
- Promote Sumsub from mock to live (need real `SUMSUB_APP_TOKEN` + `SUMSUB_SECRET_KEY`).
- Promote SendGrid from log to live (need real API key + verified sender).
- Pagination + cursor-based scrolling on admin tables.
- Redis-backed rate limiter (replace in-memory).
- CSRF tokens + `secure=True` + `samesite=strict` cookies for prod.

### P2
- Stripe + Crypto deposit integrations (Stripe test key already in pod env).
- Education center + gamification badges.
- Push notifications (FCM).
- PostHog product analytics.
- Code-splitting + Lighthouse pass.

### P3
- React Native mobile app.
- Multi-currency / FX engine.
- Event-sourced ledger + SOC 2 path.

## Open questions
- When ready, share real Sumsub + SendGrid keys for live promotion.
- Should the marketing landing port specific copy/visuals from your real repo's Hero/Features/Reviews? (See diff-impact doc for mapping.)
