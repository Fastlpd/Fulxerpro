# FulxerPro — Diff & Migration Impact Analysis

> Maps every artifact in `github.com/Fastlpd/fulxerpro` (your real repo) to its replacement / equivalent / status in the new `/app/` production-grade implementation.

## A. Tech Stack Swap (justified)

| Your repo | New `/app/` | Why |
|-----------|-------------|-----|
| Vite + TS frontend only | **FastAPI backend + React frontend** | Fintech requires server-side trust boundary, auth, ledger, audit. Browser-only is not viable. |
| Tailwind v4 + r3f scenes | Tailwind v3 + Shadcn primitives + framer-motion | Aligned with Emergent platform's verified stack; r3f can be added incrementally to marketing pages. |
| zustand (unused) | React Context (`AuthContext`, `ThemeContext`) | Smaller surface for current scope; can upgrade later. |
| Axios direct calls | `lib/api.js` axios instance with `withCredentials` | Centralised auth, error handling, base URL. |
| socket.io-client (unused) | Removed — SSE for streaming concierge | Only one realtime channel needed (LLM stream). |

## B. File-by-File Migration Status

### Marketing / Landing sections
| Your file | Status | New equivalent |
|-----------|--------|---------------|
| `src/components/layout/Header.tsx` | ⚖ Replaced | `pages/Landing.jsx` header (sticky, glass) |
| `src/components/layout/Footer.tsx` | ⚖ Replaced | `pages/Landing.jsx` footer |
| `src/components/sections/Hero.tsx` | ⚖ Replaced (richer) | `Landing.jsx` hero with KPI strip + serif headline |
| `src/components/sections/Features.tsx` | ⚖ Replaced | `Landing.jsx` "Why FulxerPro" 6-card grid |
| `src/components/sections/Reviews.tsx` | ✂ Deferred | Add as `pages/landing/Testimonials.jsx` next sprint |
| `src/components/sections/CarInvestment.tsx` | ✂ Deferred | Asset-vertical pages — add when real product needs them |
| `src/components/sections/HousingInvestment.tsx` | ✂ Deferred | Same as above |
| `src/components/sections/InvestToOwn.tsx` | ✂ Deferred | Add as marketing sub-route |
| `src/components/sections/InvestmentPlans.tsx` | ⚖ Replaced | `Landing.jsx` plans teaser + real `Plans.jsx` page (DB-backed) |
| `src/components/sections/MarketData.tsx` | ✂ Deferred | Will become live ticker on dashboard via Alpha Vantage server-side |
| `src/components/sections/market/StockMarket.tsx` | 🔴 Removed | Hardcoded API key leak; will be re-built as **server-proxied** route with cached responses |
| `src/components/sections/market/CryptoMarket.tsx` | 🔴 Removed | Same as above — server-side CoinGecko proxy needed |
| `src/components/canvas/Scene.tsx` | ✂ Deferred | r3f hero scene can be ported into `Landing.jsx` later — currently using premium architectural photo |

### Dashboard (the critical fintech surface)
| Your file (UI-only mock) | New equivalent (real, backend-wired) |
|--------------------------|---------------------------------------|
| `dashboard/DashboardSection.tsx` | `pages/Dashboard.jsx` — KPIs from `/api/portfolio/summary`, allocation pie, recent activity |
| `dashboard/Balance.tsx` | Balance card inside `Dashboard.jsx` + `Wallet.jsx` (server-authoritative) |
| `dashboard/Deposit.tsx` | `pages/Wallet.jsx` deposit tab → `POST /api/transactions/deposit` → admin approval queue |
| `dashboard/Withdraw.tsx` | `pages/Wallet.jsx` withdraw tab → atomic balance hold → admin decision |
| `dashboard/TransactionHistory.tsx` | `pages/Transactions.jsx` — filterable ledger from `/api/transactions` |
| `dashboard/StockTrading.tsx` | ✂ Deferred — not part of current investment-plan model; could become broker-integration phase |

### Brand-new surfaces in `/app/` (not present in your repo)
| New file | Purpose |
|----------|---------|
| `pages/Login.jsx`, `Register.jsx` | Real auth (JWT cookies + bcrypt + brute-force lockout) |
| `pages/KYC.jsx` | Submission flow + admin decision; Sumsub sandbox integration scaffolded |
| `pages/Referrals.jsx` | 5% commission tree, downstream investor table |
| `pages/Security.jsx` | TOTP 2FA enrollment (required for admins) |
| `pages/Admin.jsx` | Control room: pending TX, pending KYC, users, audit log, analytics |
| `components/ConciergeWidget.jsx` | **AI Investor Concierge** (Claude Sonnet 4.5) with full FulxerPro context + persistent memory |

### Infrastructure / build artifacts in your repo — handling
| Your file | Status |
|-----------|--------|
| `fulxer termites/src_backup/` (~600 LOC duplicate) | 🔴 Delete on the next push — confirmed dead code |
| `deploy.sh`, `deploy_to_aws.ps1`, `update_frontend.ps1`, `enhance-project.ps1`, `monitor_acm_validation.ps1` | Replace with single GitHub Actions workflow (`docs/05-deployment-plan.md`) |
| `netlify.toml` | OK for **frontend-only preview**; not enough for backend deploy — needs Render/Fly/Railway or AWS ECS for FastAPI |
| `package.json` deps: `socket.io-client`, `zustand`, `tempus`, `hamo`, `three-mesh-bvh` | 🔴 Remove — unused, save ~150KB gzipped |

## C. Backend additions (no equivalent in your repo)

Every one of these is **net new**:

- `backend/server.py` — entrypoint with /api/v1 + /api
- `backend/core/{config,db,security,deps}.py` — config, motor, JWT+bcrypt, RBAC deps
- `backend/services/{audit,rate_limit,email,scheduler,sumsub}.py` — cross-cutting
- `backend/routers/{auth,plans,investments,transactions,portfolio,referrals,kyc,admin,twofa,concierge}.py` — 10 routers
- `backend/models/schemas.py` — Pydantic DTOs

## D. Data You Can Migrate from Your Repo

| Type | Source | Action |
|------|--------|--------|
| Brand copy (taglines, descriptions) | `Hero.tsx`, `Features.tsx`, `Reviews.tsx` | Copy text strings into `Landing.jsx` |
| Asset images | `src/assets/` | Move to `/app/frontend/public/` |
| Color palette intentions | `tailwind.config.js` | Compare with `/app/design_guidelines.json` |
| Reviews / testimonials data | `Reviews.tsx` | Move to `db.testimonials` collection |

## E. Recommended Git Strategy (when you want to push back)

```bash
# In your local clone of Fastlpd/fulxerpro
git checkout -b production-overhaul
rm -rf "fulxer termites"   # remove duplicate
# Replace src/ with /app/frontend/src/
# Add /app/backend/ as new top-level
git add . && git commit -m "feat: production-grade backend + secure dashboard"
git push origin production-overhaul
# Open PR for review
```

Use Emergent's **"Save to GitHub"** button (top of chat) — it preserves both directories automatically.
