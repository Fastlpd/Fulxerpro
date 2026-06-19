# FulxerPro — Phase 1 Deep Repository Analysis

> Analysis performed against the **actual repository** at `https://github.com/Fastlpd/fulxerpro` (commit cloned 2026-01).

## 1. Tech Stack Inventory (actual repo)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Build | **Vite 7.x** | Fast dev server, ESM-first |
| Language | **TypeScript 5** | Strict mode enabled in `tsconfig` |
| Framework | **React 18.3** | (deps file requests React 19 types, mismatch) |
| Styling | **Tailwind CSS 4** | via `@tailwindcss/vite` plugin |
| 3D | **three.js 0.182**, **@react-three/fiber 8.18**, **@react-three/drei 9.122** | r3f used in `components/canvas/Scene.tsx` |
| Animation | **framer-motion 12.26** | Heavy use in landing sections |
| State | **zustand 5.0.10** | **Listed but never used** in the codebase |
| Charts | **recharts 3.6** | Used in dashboard |
| HTTP | **axios 1.13** | Used directly from components (no service layer) |
| Realtime | **socket.io-client 4.8** | **Listed but never used** |
| Smooth scroll | **lenis 1.3**, **hamo**, **tempus** | All present, only lenis verified imported |
| Backend | **NONE** | Repo is **frontend-only** — no server, no DB, no auth |
| Deploy | netlify.toml + deploy.sh + multiple PowerShell scripts | Fragmented |

## 2. Folder Structure (real repo)

```
fulxerpro/
├── README.md, LICENSE, package.json, package-lock.json
├── index.html, vite.config.ts, tsconfig*.json, postcss.config.js, tailwind.config.js
├── netlify.toml, deploy.sh, deploy_to_aws.ps1, enhance-project.ps1, monitor_acm_validation.ps1, update_frontend.ps1
├── public/vite.svg
├── src/
│   ├── App.tsx, App.css, main.tsx, index.css, assets/react.svg
│   └── components/
│       ├── canvas/Scene.tsx               (3D background)
│       ├── layout/{Header.tsx, Footer.tsx}
│       ├── sections/
│       │   ├── Hero.tsx (90 LOC)
│       │   ├── Features.tsx (93)
│       │   ├── Reviews.tsx (95)
│       │   ├── CarInvestment.tsx (89)
│       │   ├── HousingInvestment.tsx (91)
│       │   ├── InvestToOwn.tsx (16)
│       │   ├── InvestmentPlans.tsx (118)
│       │   ├── MarketData.tsx (24)
│       │   └── market/{StockMarket.tsx, CryptoMarket.tsx}
│       └── dashboard/
│           ├── DashboardSection.tsx (43)
│           ├── Balance.tsx (66)
│           ├── Deposit.tsx (61)
│           ├── Withdraw.tsx (61)
│           ├── TransactionHistory.tsx (12)
│           └── StockTrading.tsx (122)
└── fulxer termites/                       ⚠ entire duplicated copy of the project
    └── src_backup/                        ⚠ ~600 LOC of dead code shipped in repo
```

**Total source LOC**: ~1,530 (real `src/`), plus ~600 LOC duplicated in `fulxer termites/src_backup/`.

## 3. Architecture (current — actual repo)

```
                    ┌──────────────────────────────┐
                    │  Browser (Vite SPA)          │
                    │                              │
                    │  React + r3f canvas          │
                    │  Tailwind UI sections        │
                    │  Dashboard widgets (UI only) │
                    └─────┬──────────┬─────────────┘
                          │          │
            (direct       │          │  (direct HTTPS calls,
             axios from   │          │   no proxy, no auth,
             components)  │          │   no rate limiting)
                          ▼          ▼
              Alpha Vantage API   CoinGecko API
              (key hardcoded)     (public, throttled)

           NO BACKEND. NO DATABASE. NO AUTH.
           Dashboard Balance/Deposit/Withdraw render
           static or local-only state.
```

## 4. Issues Found (Severity-ranked)

### 🔴 Critical
| # | File / Area | Issue |
|---|-------------|-------|
| C1 | `src/components/sections/market/StockMarket.tsx:14` | `const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY'` — placeholder ships with code; once filled, the **real key is embedded in the JS bundle and visible to anyone** opening DevTools. |
| C2 | Repo root | **No backend exists** — all "investment platform" functionality (balance, deposit, withdraw, transaction history) is UI shell only, no persistence, no auth, no settlement. Cannot serve real investors. |
| C3 | Whole repo | **No authentication, no session, no RBAC, no audit trail** — a fintech-themed UI must not go to production without these. |
| C4 | `fulxer termites/src_backup/` | ~600 lines of duplicated dead code shipped to git history and Netlify, inflating bundle search and confusing contributors. |

### 🟠 High
| # | File / Area | Issue |
|---|-------------|-------|
| H1 | All `dashboard/*.tsx` | Pure UI mockups — no API, no validation, no error states, no loading states. |
| H2 | Frontend → CoinGecko direct calls (`CryptoMarket.tsx:24`) | Browser IP rate-limited; throttling will hit users; no caching layer. |
| H3 | `package.json` deps | **Unused**: `socket.io-client`, `zustand`, `tempus`, `hamo`, `three-mesh-bvh` — bundle bloat (~150KB gzipped wasted). |
| H4 | No `.env` usage anywhere in `src/` | Secrets/config can only be hardcoded. |
| H5 | No tests | Zero unit/integration/e2e tests. |
| H6 | TypeScript types mismatch | `@types/react@19.x` but runtime `react@18.3` — compile-time vs runtime drift. |
| H7 | Deploy scripts | `deploy.sh`, `deploy_to_aws.ps1`, `enhance-project.ps1`, `monitor_acm_validation.ps1`, `update_frontend.ps1` — fragmented, no CI. |

### 🟡 Medium
- No code-splitting / route-based lazy loading; r3f + three.js force a >500KB initial JS payload.
- No error boundaries — a thrown error in any section crashes the whole app.
- No accessibility audit — `<button>` semantics inconsistent, color contrast not validated, no focus traps.
- No structured logging.
- Three.js heavy scene runs unconditionally — battery / CPU drain on mobile.
- Hardcoded text/copy throughout — no i18n.

### 🟢 Low / Hygiene
- Inconsistent file naming (`PascalCase.tsx` + `kebab-case.css`).
- `README.md` is empty / boilerplate.
- No prettier/lint-staged hooks committed.

## 5. Component Interaction Map (real repo)

```
main.tsx
  └─ App.tsx
       ├─ Scene.tsx              (r3f canvas, decorative)
       ├─ Header.tsx
       ├─ Hero.tsx               ─┐
       ├─ Features.tsx           │
       ├─ MarketData.tsx        ─┼─► axios → CoinGecko / Alpha Vantage
       │    ├─ StockMarket.tsx   │       (key leaked, throttled, no cache)
       │    └─ CryptoMarket.tsx ─┘
       ├─ InvestmentPlans.tsx    (static cards, no backend)
       ├─ CarInvestment.tsx
       ├─ HousingInvestment.tsx
       ├─ InvestToOwn.tsx
       ├─ Reviews.tsx
       ├─ DashboardSection.tsx
       │    ├─ Balance.tsx              ← all local state / fake numbers
       │    ├─ Deposit.tsx              ← submits to nothing
       │    ├─ Withdraw.tsx             ← submits to nothing
       │    ├─ TransactionHistory.tsx   ← hardcoded list
       │    └─ StockTrading.tsx         ← UI only
       └─ Footer.tsx
```

## 6. Migration Recommendation

The **only safe path** to a production-grade fintech platform from this starting point is to:
1. **Keep** the marketing/landing visual language and 3D hero as inspiration.
2. **Replace** the dashboard UI with a real authenticated investor dashboard backed by a server, database, and audit log.
3. **Discard** `fulxer termites/src_backup/` entirely.
4. **Re-implement** the backend from scratch (already done in this Emergent workspace — see `/app/backend/`).
5. **Port** the marketing sections from your repo (Hero, Features, CarInvestment, etc.) into the new app's `Landing.jsx` if you want their copy/visuals preserved — they can be added incrementally.

See `/app/docs/diff-impact-analysis.md` for a file-by-file mapping of what we now have vs. what your repo had.
