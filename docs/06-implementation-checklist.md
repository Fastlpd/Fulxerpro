# FulxerPro — Step-by-Step Implementation Checklist

> Use this as the source of truth for the engineering team. Tick items off as PRs land.

## ✅ Phase 1 — Foundation (delivered)
- [x] Modular backend (`core/`, `routers/`, `services/`, `models/`)
- [x] `/api/v1` versioning + legacy `/api` alias
- [x] Env-driven config (no hardcoded secrets)
- [x] MongoDB indexes on startup (`users.email` unique, etc.)
- [x] Global exception handler + structured logging
- [x] Audit logging service (append-only)

## ✅ Phase 2 — Authentication & RBAC (delivered)
- [x] Bcrypt password hashing
- [x] JWT access (60min) + refresh (7d), httpOnly cookies + Bearer fallback
- [x] Roles: `user`, `admin`, `super_admin`
- [x] `require_role()` / `require_admin` dependency
- [x] Rate limit on `/auth/login` (10/min) and `/auth/register` (5/5min)
- [x] Brute-force lockout (5 fails → 15min per ip:email)
- [x] Admin seeded from env on startup

## ✅ Phase 3 — Investment Platform (delivered)
- [x] Plans marketplace (admin CRUD, public list)
- [x] Investment with atomic balance debit + ledger entry
- [x] Deposit (pending → admin approve credits balance)
- [x] Withdrawal (pending → admin approve OR reject refunds balance)
- [x] KYC submission + admin decision + gate on invest/withdraw
- [x] Referral codes auto-issued + 5% commission accrual
- [x] Portfolio summary endpoint (KPIs + allocation)
- [x] Admin analytics (AUM, deposit/withdraw volume, pending counts)

## ✅ Phase 4 — UI/UX (delivered)
- [x] Premium organic-earthy light theme + dark mode
- [x] Cormorant Garamond + Manrope + JetBrains Mono
- [x] Landing page with hero, KPI strip, plans teaser, why-section, CTA
- [x] Login & Register split-pane with cinematic side panel
- [x] App shell: sidebar (desktop) + mobile top nav + scroll-snap tabs
- [x] Dashboard with KPI cards + allocation pie + recent activity
- [x] Plans grid + invest modal with maturity preview
- [x] Wallet segmented deposit/withdraw form
- [x] Transactions filterable ledger
- [x] Referrals link/share + downstream table
- [x] KYC multi-field form + status card
- [x] Admin control room with 5 tabs

## 🟡 Phase 5 — Short-term polish (next sprint)
- [ ] APScheduler job to mature investments daily → credit balance, mark `status: matured`
- [ ] SendGrid: account-created, deposit-approved, withdrawal-approved emails
- [ ] Pagination on `/admin/users`, `/admin/audit-logs`, `/transactions`
- [ ] Redis-backed rate limit + portfolio summary cache (30s)
- [ ] Real KYC integration (Sumsub or Persona)
- [ ] CSRF double-submit cookie + production cookie flags (`secure`, `samesite=strict`)
- [ ] TOTP 2FA for admins
- [ ] `React.lazy` per-route code splitting + Lighthouse pass

## 🟡 Phase 6 — Growth features
- [ ] AI Support Assistant (Claude Sonnet 4.5 via Universal Key)
- [ ] Crypto deposits via Coinbase Commerce webhook
- [ ] Stripe card deposits
- [ ] Gamification badges + XP
- [ ] Education center (lessons + quiz)
- [ ] Push notifications (FCM web)
- [ ] PostHog product analytics + UTM attribution
