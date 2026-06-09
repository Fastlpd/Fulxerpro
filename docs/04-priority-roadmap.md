# FulxerPro — Priority Roadmap

## Immediate (this sprint) — ✅ shipped in this iteration
- Modular FastAPI backend with `core/`, `routers/`, `services/`, `models/`
- JWT cookie auth + bcrypt + RBAC + brute-force lockout + rate limiting
- Investment plans marketplace + atomic invest flow with KYC gate
- Deposit / withdraw workflow with admin approval queue
- Portfolio dashboard (KPIs + allocation pie + recent activity)
- Referral system (5% commission, downstream table)
- KYC submission + admin decision flow
- Admin control room (analytics, pending TX, KYC, users, audit log)
- Premium light/dark theme with Cormorant + Manrope + JetBrains Mono
- `/api/v1` API versioning + legacy `/api` alias
- Audit logging on every security & financial event

## Short-term (2–4 weeks)
1. **Background jobs** — APScheduler to mature investments + credit returns daily.
2. **Email transactional** — SendGrid integration for verification, approvals, withdrawals.
3. **Pagination + filters** on admin tables.
4. **Redis** for rate limiter + cache layer (portfolio summary 30s TTL).
5. **Real KYC** — Sumsub or Persona integration; remove placeholder document fields.
6. **CSRF tokens** + secure cookie flags for production.
7. **2FA TOTP** for admins and opt-in for users.
8. **Code-splitting** + lazy-loaded routes on the frontend.

## Medium-term (1–3 months)
1. **Crypto deposits** — direct on-chain via Coinbase Commerce or BitPay webhook.
2. **Stripe** for card deposits (already pre-configured in pod env).
3. **AI Support Assistant** — Claude Sonnet 4.5 (Universal Key) chat for investor help.
4. **Push notifications** (FCM web).
5. **Education center** — investor lessons + quizzes.
6. **Gamification** — XP bar, achievement badges (first investment, KYC verified, 3 referrals).
7. **Affiliate engine v2** — multi-tier commission, custom URLs, leaderboard.
8. **CRM** — HubSpot or sync events to Segment.
9. **Marketing analytics** — PostHog + UTM attribution.

## Long-term (3–12 months)
1. **Mobile app** (React Native) sharing API surface.
2. **Multi-currency / FX engine**.
3. **Institutional API** for high-value clients.
4. **Sharded MongoDB Atlas** for regulated regions.
5. **Event sourcing** for ledger immutability + compliance replay.
6. **SOC 2 Type II** certification path.
7. **DAO-style governance plans** for crypto-native investors.
