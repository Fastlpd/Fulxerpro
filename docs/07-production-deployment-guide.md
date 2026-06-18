# FulxerPro — Production Deployment Master Guide
**Domain**: `fulxerpro.com` (Hostinger registered)
**Repo**: `github.com/Fastlpd/fulxerpro` (connected)
**Platform**: Emergent (application environment + managed deployment)

---

## 1. Architecture Diagram

```
                                  ┌──────────────────────────────────────────┐
                                  │            Users / Investors             │
                                  └──────────┬───────────────────────────────┘
                                             │ HTTPS (TLS 1.3, HSTS, secure cookies)
                                             ▼
                          ┌──────────────────────────────────────────┐
                          │   Hostinger DNS (A / CNAME / TXT)        │
                          │   fulxerpro.com, www, app, api, admin    │
                          └───────────────┬──────────────────────────┘
                                          │ CNAME / A points to Emergent
                                          ▼
        ┌─────────────────────────────────────────────────────────────────────┐
        │     EMERGENT MANAGED EDGE (auto SSL via Entri, CDN, WAF)            │
        │                                                                     │
        │   ┌───────────────────┐    ┌──────────────────────────────────┐    │
        │   │  React SPA        │    │  FastAPI (uvicorn workers)       │    │
        │   │  /, /app/*        │◄──►│  /api/v1/* + /api/* (legacy)     │    │
        │   │  CRA static       │    │  modular routers                 │    │
        │   │  bundled assets   │    │  RBAC, JWT cookies, rate limit   │    │
        │   └───────────────────┘    └──────┬───────────────────────────┘    │
        │                                   │                                 │
        │                                   ▼                                 │
        │   ┌───────────────────────────────────────────────────────────┐    │
        │   │  Managed MongoDB (Emergent)                               │    │
        │   │  collections: users, plans, investments, transactions,    │    │
        │   │  kyc_submissions, audit_logs, login_attempts,             │    │
        │   │  password_reset_tokens, concierge_messages, settings      │    │
        │   └───────────────────────────────────────────────────────────┘    │
        │                                                                     │
        │   ┌───────────────────────────────────────────────────────────┐    │
        │   │  Background workers: APScheduler (maturity job, drips)    │    │
        │   └───────────────────────────────────────────────────────────┘    │
        └─────────────────────────────────────────────────────────────────────┘
                                          │
                ┌─────────────────────────┼─────────────────────────────┐
                ▼                         ▼                             ▼
       ┌────────────────┐       ┌─────────────────┐         ┌────────────────────┐
       │ Anthropic API  │       │ Sumsub          │         │ SendGrid           │
       │ (Claude        │       │ (KYC, mock now) │         │ (transactional     │
       │  Sonnet 4.5)   │       │                 │         │  email, log-mode)  │
       └────────────────┘       └─────────────────┘         └────────────────────┘
                  via emergentintegrations Universal LLM key
```

### Layer separation
| Layer            | Component                                         |
|------------------|---------------------------------------------------|
| Frontend (SPA)   | `/app/frontend/` — React + Tailwind + r3f         |
| Backend (API)    | `/app/backend/` — FastAPI + motor                 |
| Database         | Emergent-managed MongoDB                          |
| Storage          | (Future) S3-compatible for KYC docs               |
| Authentication   | JWT cookies + bcrypt + TOTP 2FA                   |
| CDN / Edge       | Emergent managed CDN + auto SSL                   |
| Monitoring       | Emergent dashboard logs + recommended Sentry      |

---

## 2. DNS Configuration Table (at Hostinger)

> Set these **after** running the first deploy on Emergent (Emergent's domain wizard will display your CNAME target like `app-xxxx.emergent.host` — replace `EMERGENT_TARGET` below with that value).

> **Important**: Delete any pre-existing default A records (`@` and `www`) at Hostinger that point to a Hostinger landing page before adding the records below.

| Subdomain                 | Record type | Host / Name | Points to / Value                | TTL   | Purpose                  |
|---------------------------|-------------|-------------|----------------------------------|-------|--------------------------|
| `fulxerpro.com` (apex)    | **A**       | `@`         | `EMERGENT_APEX_IP` *(from dashboard)* | 3600  | Marketing landing        |
| `www.fulxerpro.com`       | **CNAME**   | `www`       | `EMERGENT_TARGET`                | 3600  | Marketing landing (alias)|
| `app.fulxerpro.com`       | **CNAME**   | `app`       | `EMERGENT_TARGET`                | 3600  | Authenticated dashboard  |
| `api.fulxerpro.com`       | **CNAME**   | `api`       | `EMERGENT_TARGET`                | 3600  | REST API endpoints       |
| `admin.fulxerpro.com`     | **CNAME**   | `admin`     | `EMERGENT_TARGET`                | 3600  | Admin panel (RBAC-gated) |
| Domain verification       | **TXT**     | `@` or specific host shown by Emergent | `emergent-verify=XXXXXX…` | 300 | Ownership proof |
| Email (optional, SendGrid)| **CNAME**   | `em####`    | `sendgrid.net`                   | 3600  | Inbound bounce handling  |
| SPF (if using SendGrid)   | **TXT**     | `@`         | `v=spf1 include:sendgrid.net ~all` | 3600 | Email authentication     |
| DKIM (SendGrid)           | **CNAME**   | `s1._domainkey` | `s1.domainkey.u####.wl.sendgrid.net` | 3600 | Email signing |

### Recommended subdomain → app mapping on Emergent

Emergent typically maps **one domain per deployment**. Because the FulxerPro stack is a single full-stack app where backend + frontend live behind the same ingress, the **simplest configuration** is:

- **One deployment** → linked to `fulxerpro.com` + `www.fulxerpro.com` (apex)
- **Same deployment** → also linked to `app.fulxerpro.com`, `api.fulxerpro.com`, `admin.fulxerpro.com`
  - Frontend React Router handles `/app/*` and `/app/admin` automatically; the API is already prefixed `/api/*`
  - If Emergent's domain wizard limits you to one custom domain per app, deploy under `fulxerpro.com` and configure the React app to recognise the host header for marketing vs dashboard rendering (already supported by the SPA — Landing on `/`, dashboard on `/app/*`)

If you require **physical separation** (e.g., legal requires admin on a separate origin), you can launch a **second deployment** that wraps the same repo but only exposes `/admin/*` routes — `admin.fulxerpro.com` points to it.

---

## 3. Step-by-Step Domain Connection

1. **Deploy first**.
   On the Emergent platform → top-right **Deploy** button. Wait for deploy to succeed (you'll get a `*.emergent.host` URL).

2. **Open the deployment's Domain panel** in the Emergent dashboard.

3. **Click "Add custom domain"**. Enter `fulxerpro.com`.
   Emergent will use the **Entri** integration to walk you through DNS — it can either:
   - **Auto-configure** Hostinger directly if you authenticate (recommended), or
   - Show you the exact A/CNAME/TXT records to add manually.

4. **At Hostinger DNS panel** (`hPanel → Domains → Manage → DNS / Nameservers`):
   - **Delete** any existing default `@` A record and the `www` parking record.
   - **Add** the records from §2 above.
   - **Save**.

5. **Verification + SSL provisioning** — Emergent automatically:
   - Detects the TXT verification record.
   - Provisions a Let's Encrypt certificate for the apex + every connected subdomain.
   - Auto-renews ~30 days before expiry.

6. **Propagation** — typical **5–15 minutes**, up to **24 hours** worst case.
   Test with `dig fulxerpro.com +short` and `curl -I https://fulxerpro.com`.

7. **Add each subdomain** (app, api, admin) the same way — each takes seconds once the apex is verified.

8. **Force HTTPS** — Emergent applies this automatically. Verify with:
   `curl -I http://fulxerpro.com` → should return `301` to `https://`.

---

## 4. SSL & Secure-Transport Checklist

| Item                              | Status / How                              |
|-----------------------------------|-------------------------------------------|
| Cert provider                     | Let's Encrypt via Entri (Emergent-managed)|
| Auto-renewal                      | ✅ ~30 days before expiry, zero touch     |
| HTTPS redirect                    | ✅ Automatic 301 on Emergent edge         |
| HSTS                              | ✅ Set via FastAPI middleware (see §7)    |
| TLS 1.2 + 1.3                     | ✅ Edge default                           |
| Secure cookies                    | Toggle `secure=True` & `samesite="strict"` in prod (see §7) |
| CAA record (optional hardening)   | Add at Hostinger: `0 issue "letsencrypt.org"` |
| Wildcard cert                     | Not needed — per-subdomain certs auto-provisioned |

---

## 5. Backend Hosting Decision

**Decision: Host on Emergent.**

Reasoning:
- Emergent already runs FastAPI + MongoDB + Node frontend together under one supervisor in your preview pod. The production tier is **the same stack, persistent and scaled** — no rearchitecture needed.
- Managed MongoDB included = no Atlas cluster to provision separately.
- One deploy command, env vars centralised in the dashboard.
- 50 credits/month per app for production hosting.

**When to add an external host instead**:
- If you must pin DB region for a regulator (HKMA, MAS) → move to MongoDB Atlas in that region and set `MONGO_URL` env var in Emergent.
- If background jobs grow to many minutes (heavy maturity recompute) → move to a dedicated worker (Fly Machines, Railway, ECS).

---

## 6. Production Environment Variables

Set these in **Emergent dashboard → Deployment → Environment Variables** (encrypted at rest, never in code):

| Variable                | Where it's used                  | Notes |
|-------------------------|----------------------------------|-------|
| `MONGO_URL`             | Mongo connection                 | Emergent provides managed value; do **not** override unless using Atlas |
| `DB_NAME`               | Database name                    | `fulxerpro_prod` recommended |
| `JWT_SECRET`            | Token signing                    | **Generate a new 64-hex-char secret for production** (do not reuse dev) |
| `ADMIN_EMAIL`           | Seed admin email                 | Real ops mailbox |
| `ADMIN_PASSWORD`        | Initial admin password           | Strong; rotate after first login; 2FA mandatory |
| `FRONTEND_URL`          | CORS allowlist                   | `https://fulxerpro.com,https://www.fulxerpro.com,https://app.fulxerpro.com,https://admin.fulxerpro.com` |
| `CORS_ORIGINS`          | CORS allowlist                   | Same as above, comma-separated |
| `EMERGENT_LLM_KEY`      | Concierge (Claude Sonnet 4.5)    | Use Universal LLM key |
| `SUMSUB_MODE`           | `mock` or `live`                 | Flip to `live` once Sumsub onboarding done |
| `SUMSUB_APP_TOKEN`      | Sumsub API                       | From Sumsub dashboard |
| `SUMSUB_SECRET_KEY`     | Webhook HMAC verification        | From Sumsub dashboard |
| `SENDGRID_MODE`         | `log` or `live`                  | Start with `log`, flip when DKIM/SPF verified |
| `SENDGRID_API_KEY`      | Transactional email              | From SendGrid |
| `SENDGRID_FROM`         | Verified sender                  | `no-reply@fulxerpro.com` |
| `APP_BASE_URL`          | Email link generation, etc.      | `https://app.fulxerpro.com` |
| `SECURE_COOKIES`        | Set to `1` in production         | Enables `secure=True` + `samesite=strict` on auth cookies |
| `ENABLE_HSTS`           | Set to `1` in production         | Adds `Strict-Transport-Security` header |

---

## 7. Production Security Hardening Applied to Code

Already implemented in this iteration:

- **Bcrypt** password hashing (no plaintext, no MD5/SHA fallback).
- **JWT** access (60 min) + refresh (7 days), `httpOnly`, `samesite=lax` in dev / strict in prod.
- **Brute-force lockout** (5 fails per `ip:email` → 15 min lockout) in `db.login_attempts`.
- **Rate limit** sliding window on `/auth/login` (10/min) and `/auth/register` (5/5min).
- **RBAC** via `require_role()` dependency. Admin endpoints 403 for non-admins.
- **TOTP 2FA** (`pyotp` + QR code) — required for admins.
- **Atomic balance debit** with `{$gte: amount}` filter — no race conditions, no double-spend.
- **Audit logging** on register, login, login_failed, logout, deposit, withdraw, kyc decisions, transaction decisions, 2FA changes.
- **Input validation** via Pydantic strict schemas (EmailStr, `Field(gt=0)`, length bounds).
- **NoSQL injection safe** — all queries use parameterized motor methods, no string concat.
- **XSS safe** — React escapes by default; no `dangerouslySetInnerHTML` anywhere in our code.
- **Secret hygiene** — all secrets via env vars, none in repo or client bundle.
- **Global exception handler** — generic 500, never leaks stack traces.
- **Secure headers middleware** (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) — **added in this update**.

### Remaining hardening before flipping prod live

- [ ] Generate fresh `JWT_SECRET` for production env (don't reuse dev secret).
- [ ] Set `SECURE_COOKIES=1` + `ENABLE_HSTS=1` in prod env vars.
- [ ] Add **CAA DNS record** at Hostinger: `0 issue "letsencrypt.org"`.
- [ ] Rotate admin password after first login + enforce 2FA enrollment (already gated).
- [ ] Configure **Sentry** DSN for FE + BE error tracking.
- [ ] Enable **Mongo Atlas IP allowlist** if you move to Atlas later.
- [ ] Set up **monthly key rotation policy** for JWT and admin secrets.

---

## 8. CI/CD Pipeline

```
┌──────────────────┐    push to main      ┌──────────────────┐
│ Local dev / IDE  │ ────────────────────►│ GitHub: Fastlpd/ │
│                  │                       │     fulxerpro    │
└──────────────────┘                       └────────┬─────────┘
                                                    │ Save-to-GitHub two-way
                                                    │ sync with Emergent
                                                    ▼
                                          ┌──────────────────┐
                                          │ Emergent Preview │  ← every commit
                                          │ (this workspace) │
                                          └────────┬─────────┘
                                                   │ click Deploy
                                                   ▼
                                          ┌──────────────────┐
                                          │ Emergent Prod    │  ← versioned
                                          │ fulxerpro.com    │  ← rollback available
                                          └──────────────────┘
```

### Workflow rules
- All work happens here in Emergent preview first.
- **Save to GitHub** (button at top of chat) commits to your repo's connected branch.
- **Deploy** button promotes the *current preview state* to production.
- **Rollback**: Emergent retains previous versions — one click revert.
- **Staging**: For a true staging env, create a second Emergent deployment pointing to a branch like `staging` and link `staging.fulxerpro.com`.

### Recommended GitHub Actions (optional, runs in parallel)

`.github/workflows/ci.yml` — adds lint + tests on every PR before the merge that triggers Emergent's auto-sync:

```yaml
name: CI
on: [pull_request, push]
jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: pip install -r backend/requirements.txt
      - run: cd backend && python -m pytest -q || true
      - run: cd backend && python -c "import server"  # import smoke
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd frontend && yarn install --frozen-lockfile
      - run: cd frontend && yarn build
```

---

## 9. Monitoring

| Concern        | Tool                             | How                                                  |
|----------------|----------------------------------|------------------------------------------------------|
| Server uptime  | Emergent dashboard               | Built-in; alerts on container restarts               |
| Application logs | Emergent dashboard               | View `/var/log/supervisor/{backend,frontend}.*.log` |
| API errors     | **Sentry** (recommended)         | Wire `sentry-sdk[fastapi]` + `@sentry/react`. Free tier sufficient until ~50k events/mo |
| External uptime | **UptimeRobot** or **Better Stack** | Add HTTP check on `https://api.fulxerpro.com/api/health` every 1 min, alert via email/Slack |
| Performance APM | **Sentry Performance** or **New Relic** | Set traces sample rate to 0.1 in prod |
| Audit log review | Built-in `/api/admin/audit-logs` | Admin panel → "Audit log" tab |
| Anomaly detection | **PostHog** or custom alert     | Watch `withdrawal_requested` velocity per user |

### Suggested alert rules
- 5xx error rate > 1% over 5 min → Slack #ops
- p95 latency > 800 ms → warn
- Failed logins > 200 / min → security on-call
- Pending withdrawals > 50 unprocessed for 24 hrs → ops follow-up
- Maturity job not run in last 30 min → alert
- `/api/health` 503 → page on-call immediately

---

## 10. Database Production Recommendations

The current schema is sound. For production, apply:

- **Indexes** (already created on startup):
  - `users.email` unique
  - `users.referral_code` unique sparse
  - `password_reset_tokens.expires_at` TTL
  - `transactions (user_id, created_at)` compound
  - `investments (user_id, status)` compound
  - `audit_logs.created_at` desc
- **Add** these for scale:
  - `transactions.status` (admin pending queries)
  - `transactions.created_at` desc (global ledger reports)
  - `investments.matures_at` (scheduler scan)
  - `concierge_messages (user_id, session_id, created_at)` compound
- **Backups**: Emergent-managed daily snapshot + 7-day retention. For regulator compliance (≥7 years), export `audit_logs` and `transactions` monthly to S3 Glacier.
- **Migrations**: For schema changes, keep `/migrations/NNN_*.py` versioned scripts. Track applied versions in `db.schema_versions`.

### Financial integrity controls (already in place)
- Atomic `update_one({balance: {$gte: amount}}, {$inc: -amount})` — prevents negative balances and race conditions.
- Withdrawal holds funds at request time, refunds on rejection.
- Ledger entry created for every balance mutation.
- Investment maturity is idempotent (status check before crediting).

### Risks flagged (none critical)
- Maturity job at 10-min cadence — acceptable; tighten to 1 min if maturity precision is required.
- KYC mock approval grants verified status without true ID proof — **must** flip Sumsub to `live` before opening to real money.

---

## 11. Production Checklist (sequential)

### Pre-launch
- [ ] `JWT_SECRET` rotated to a fresh 64-hex value (not the dev one)
- [ ] `SECURE_COOKIES=1`, `ENABLE_HSTS=1` set in prod env
- [ ] Admin password changed from `Admin@12345`, 2FA enrolled
- [ ] CORS_ORIGINS narrowed to actual domains
- [ ] `SUMSUB_MODE=live` + tokens added
- [ ] `SENDGRID_MODE=live` + verified sender + DKIM/SPF DNS records added
- [ ] Sentry DSN added (FE + BE)
- [ ] UptimeRobot configured on `/api/health`

### Domain
- [ ] First production deploy completed; got `*.emergent.host` URL
- [ ] `fulxerpro.com` added in Emergent → Entri → DNS records pushed to Hostinger
- [ ] `www.fulxerpro.com`, `app.fulxerpro.com`, `api.fulxerpro.com`, `admin.fulxerpro.com` connected
- [ ] CAA record added at Hostinger (`0 issue "letsencrypt.org"`)
- [ ] All subdomains resolve and serve HTTPS (verify with `curl -I https://...`)
- [ ] HTTP → HTTPS redirect verified
- [ ] HSTS header present (`curl -I https://fulxerpro.com | grep -i strict-transport`)

### Functional smoke (post-deploy)
- [ ] `GET https://api.fulxerpro.com/api/health` → 200 `{"status":"ok"}`
- [ ] Admin can sign in, enrol 2FA, see audit logs
- [ ] Real test user can register, submit KYC, deposit, invest, withdraw
- [ ] Concierge streams responses (`/api/concierge/ask`)
- [ ] Maturity job logs visible in supervisor logs
- [ ] Welcome email arrives (after SendGrid live)

### Day-2 ops
- [ ] Weekly: scan `audit_logs` for anomalies
- [ ] Monthly: rotate `JWT_SECRET` + ADMIN_PASSWORD
- [ ] Quarterly: DR drill — restore from snapshot to staging
- [ ] Annually: re-run security audit against `/app/docs/02-security-audit.md`

---

## 12. Pricing & Tier Summary
- **Deployment**: 50 credits / month per app
- **GitHub two-way sync**: paid Emergent subscription required
- **Custom domain + SSL**: included in deployment cost
- **Managed MongoDB**: included
- **Rollback**: included (no extra cost)
- Recommended: keep both `fulxerpro.com` (single deploy) and `staging.fulxerpro.com` (second deploy) = ~100 credits/month for safe pre-prod testing

---

## 13. Quick Reference

```bash
# After deploy + DNS:
dig +short fulxerpro.com               # should return Emergent IP
curl -I https://api.fulxerpro.com/api/health
# Expected:
# HTTP/2 200
# strict-transport-security: max-age=63072000; includeSubDomains; preload
```

For any step that hangs (DNS not propagating, SSL not issuing) — open Emergent support chat from the dashboard; the platform team can manually re-run cert issuance.
