# FulxerPro — Technical Debt & Risk Register

## Items intentionally deferred (P1 — short term)

| ID | Item | Risk | Mitigation plan |
|----|------|------|-----------------|
| TD-01 | In-memory rate limiter | Won't scale horizontally | Move to Redis sliding-window |
| TD-02 | No background scheduler for matured investments | Investments stay `active` after maturity until manually closed | Add APScheduler/Celery beat to flip `status: matured` and credit balance |
| TD-03 | No email/push notifications | Users not notified of approvals | Integrate SendGrid / Resend (transactional) + FCM (push) |
| TD-04 | Pagination missing on lists | Slow at scale | Add cursor pagination on `/transactions`, `/admin/users`, `/admin/audit-logs` |
| TD-05 | No frontend code-splitting | Initial bundle larger than needed | `React.lazy` per route |
| TD-06 | No 2FA on admin | Compromised admin = full takeover | TOTP enrollment + step-up auth |
| TD-07 | KYC: text fields only | Doesn't replace true ID provider | Wire Sumsub / Persona; store provider verification ID |
| TD-08 | Plans stored as flat docs | Hard to version | Add `version` field and historical snapshots |
| TD-09 | Single-currency (USD) | Cannot internationalize | Add `currency` field on transactions/balances + FX service |
| TD-10 | No webhooks for crypto deposits | Manual admin approval blocks UX | Integrate node provider + automatic confirmation count |

## Items recommended (P2 — medium term)
- Move from CRA to **Vite** or **Next.js App Router** (perf + SSR for marketing + SEO).
- Replace REST `/portfolio/summary` aggregation with materialized view if user count >100k.
- Multi-tenant sharding by region (MongoDB Atlas + zone sharding).
- Event bus (Kafka / SNS) for downstream services (notifications, BI warehouse).
- Feature flag system (Unleash / LaunchDarkly) for A/B testing onboarding.

## Items optional / nice-to-have (P3 — long term)
- Mobile app (React Native) sharing API.
- Reinvestment automation rules engine.
- GraphQL API surface alongside REST for advanced clients.
- In-product **AI portfolio assistant** (Claude Sonnet 4.5 via Universal Key).
