# FulxerPro — Architecture Report

## 1. System Overview
FulxerPro is a fintech investment platform built on a **modular three-tier architecture**:

```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌──────────────────┐
│  React 19 SPA           │ →   │  FastAPI 0.110          │ →   │  MongoDB         │
│  (CRA + Tailwind +      │ ←   │  (motor async driver)   │ ←   │  (motor)         │
│  Shadcn + Recharts)     │     │  /api/v1 + /api alias   │     │                  │
└─────────────────────────┘     └─────────────────────────┘     └──────────────────┘
   httpOnly JWT cookies            modular routers + RBAC          5 collections
```

## 2. Backend Module Map
```
backend/
├── server.py               # entrypoint, lifespan, seeding
├── core/
│   ├── config.py          # env-typed settings
│   ├── db.py              # motor client + indexes
│   ├── security.py        # bcrypt + JWT (HS256, 60min access, 7d refresh)
│   └── deps.py            # get_current_user, require_role(*), require_admin
├── routers/
│   ├── auth.py            # register/login/logout/me/refresh
│   ├── plans.py           # marketplace CRUD
│   ├── investments.py     # atomic balance debit, ledger entry
│   ├── transactions.py    # deposits, withdrawals, admin decisions
│   ├── portfolio.py       # aggregated summary + allocation
│   ├── referrals.py       # 5% commission tree
│   ├── kyc.py             # submission + admin review
│   └── admin.py           # users, analytics, audit logs
├── services/
│   ├── audit.py           # append-only audit_logs collection
│   └── rate_limit.py      # in-memory sliding window
└── models/schemas.py      # Pydantic request/response DTOs
```

## 3. Frontend Module Map
```
frontend/src/
├── App.js                  # Router + Auth/Theme providers + Protected/AdminRoute
├── context/
│   ├── AuthContext.jsx    # session state, login/register/logout/refresh
│   └── ThemeContext.jsx   # dark/light persisted in localStorage
├── lib/api.js             # axios instance with withCredentials
├── components/AppLayout.jsx  # sidebar nav + mobile top nav
└── pages/
    ├── Landing.jsx        # marketing hero + plans teaser + trust signals
    ├── Login.jsx, Register.jsx
    ├── Dashboard.jsx      # KPIs, allocation pie, recent activity
    ├── Plans.jsx          # marketplace + invest modal with atomic confirm
    ├── Wallet.jsx         # deposit/withdraw segmented toggle
    ├── Transactions.jsx   # filterable ledger
    ├── Referrals.jsx      # link, stats, downstream table
    ├── KYC.jsx            # multi-field submission + status card
    └── Admin.jsx          # tabs: overview, pending TX, KYC, users, audit
```

## 4. API Surface (v1)
| Group        | Endpoints |
|--------------|-----------|
| Auth         | `/auth/{register,login,logout,me,refresh}` |
| Plans        | `GET /plans`, `GET /plans/all*`, `POST/PATCH/DELETE /plans*` (*admin) |
| Investments  | `POST /investments`, `GET /investments` |
| Transactions | `GET /transactions`, `POST /transactions/{deposit,withdraw}`, `GET /transactions/pending*`, `POST /transactions/{id}/decision*` |
| Portfolio    | `GET /portfolio/summary` |
| Referrals    | `GET /referrals/me` |
| KYC          | `POST /kyc/submit`, `GET /kyc/status`, `GET /kyc/pending*`, `POST /kyc/{user_id}/decision*` |
| Admin        | `GET /admin/{users,analytics,audit-logs}` |

Both `/api/v1/*` and legacy `/api/*` paths are served.

## 5. Data Model
```
users              { id, email(unique), name, password_hash, role, kyc_status,
                     referral_code(unique), referred_by, balance, created_at }
plans              { id, name, description, roi_percent, duration_days,
                     min_amount, max_amount, risk_level, active, created_at }
investments        { id, user_id, plan_id, plan_name, amount, expected_return,
                     roi_percent, duration_days, status, started_at, matures_at }
transactions       { id, user_id, type, amount, method, reference?, destination?,
                     status, decided_by?, decided_at?, decision_note?, created_at }
kyc_submissions    { id, user_id(unique upsert), full_legal_name, dob,
                     country, document_type, document_number, address,
                     status, submitted_at, decided_at? }
audit_logs         { id, event_type, user_id, ip, metadata, created_at }
login_attempts     { identifier, failed, locked_until, last_attempt }
password_reset_tokens { token, user_id, expires_at(TTL), used }
```

Indexes: `users.email` unique, `users.referral_code` unique sparse, TTL on reset tokens, compound `(user_id, created_at)` on transactions.

## 6. Interaction Patterns
- **Cookie-based JWT** (`httpOnly`, `samesite=lax`) on `/auth/login` and `/auth/register`. Bearer fallback supported.
- **RBAC** enforced via `Depends(require_admin)` at the route level — no admin logic leaks into router bodies.
- **Atomic financial mutations** use `db.users.update_one({balance: {$gte: amount}}, $inc -amount)` to prevent race conditions on the balance.
- **Audit logging** runs on every auth event, KYC decision, investment, and transaction decision — append-only.
- **Rate limiting** sliding window on `/auth/login` (10/min) and `/auth/register` (5/5min) per IP, plus per-`ip:email` brute-force lockout (5 fails → 15min).
