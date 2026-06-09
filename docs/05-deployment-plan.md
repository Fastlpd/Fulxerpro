# FulxerPro — Production Deployment Plan

## 1. Environments
| Env        | Purpose                              | Secrets store |
|------------|--------------------------------------|---------------|
| Local      | Developer machines                   | `.env` file (gitignored) |
| Preview    | Per-PR via Emergent / Vercel         | Encrypted secrets per env |
| Staging    | Pre-prod mirror, anonymized data     | Vault / AWS Secrets Manager |
| Production | Live traffic                         | Vault / AWS Secrets Manager |

## 2. Stack & Containerization
- **Backend**: `python:3.11-slim` + uvicorn-workers, gunicorn supervisor in prod.
- **Frontend**: `node:20-alpine` build → static assets to S3/CloudFront.
- **DB**: MongoDB Atlas (M30+ for prod, replica set, point-in-time backups).
- **Cache/queue**: Redis (ElastiCache or Upstash) for rate limit + APScheduler lock.

## 3. CI/CD (recommended GitHub Actions)
```yaml
.github/workflows/ci.yml
  - lint (ruff, eslint)
  - test (pytest, jest)
  - build images
  - push to ECR
  - deploy to staging on merge → main
  - manual promotion to production
```
- **Smoke tests** post-deploy: `/api/health`, `/api/auth/me` with seeded token.

## 4. Migrations
- MongoDB is schema-less; use **versioned migration scripts** in `/migrations/NNN_*.py` for index changes, document backfills, role grants. Track applied versions in `db.schema_versions`.

## 5. Backups & DR
- Atlas continuous backup (PITR) ≤ 24h RPO, restore tested monthly.
- Cross-region snapshot retention 90 days.
- DR drill quarterly: spin up replica from snapshot, smoke-test FE/BE.

## 6. Monitoring & Alerting
- **Metrics**: Prometheus (uvicorn instrumentator) + Grafana.
- **Errors**: Sentry on FE + BE.
- **APM**: Datadog or New Relic.
- **Alerts**:
  - 5xx rate > 1% over 5min → Slack #ops critical
  - p95 latency > 800ms → warn
  - Pending withdrawals > 50 unprocessed for 24h → ops follow-up
  - Failed login spike > 200/min → security on-call

## 7. Scalability Roadmap
| Stage | Users | Action |
|-------|-------|--------|
| 0     | <5k   | Single-node FastAPI + Atlas M10 |
| 1     | 5–50k | 3× FastAPI replicas behind ALB, Redis cache, Atlas M30 |
| 2     | 50–500k | Read replicas, materialized portfolio view, S3-backed audit log archive |
| 3     | 500k+ | Zone sharding by region, event-sourced ledger, Kafka pipeline |

## 8. Observability hooks already in code
- `/api/health` returns 503 on DB failure.
- Audit logs queryable by event type, user, IP.
- Global exception handler logs full stack trace, returns generic message.
