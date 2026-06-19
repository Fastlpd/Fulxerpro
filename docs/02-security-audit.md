# FulxerPro — Security Audit Report

## Threat Surface & Controls Implemented

| Threat                       | Mitigation                                                                 | Status |
|------------------------------|----------------------------------------------------------------------------|--------|
| Credential theft (XSS)       | JWT in **httpOnly cookies**, never exposed to JS                           | ✅ |
| Brute-force login            | Sliding-window rate limit + IP/email lockout (5 fails → 15min)             | ✅ |
| Password disclosure          | **bcrypt** with random salt; raw passwords never stored                    | ✅ |
| Replay / stale token         | 60min access TTL + 7d refresh; `type` claim distinguishes both             | ✅ |
| Privilege escalation         | Role claim verified server-side via `require_role()` dependency            | ✅ |
| SQL injection                | MongoDB + parameterized motor queries; no raw concatenation                | ✅ |
| NoSQL injection              | Pydantic validates all bodies — no operator passthrough                    | ✅ |
| Insufficient input validation| Strict Pydantic schemas (`EmailStr`, `Field(gt=0)`, length bounds)         | ✅ |
| CSRF (cookie auth)           | `samesite=lax` + custom origin allowlist                                   | ⚠ Add CSRF token for non-idempotent in prod |
| CORS misconfig               | Explicit origin list when credentials enabled                              | ⚠ Tighten to actual FE origin in prod |
| Insufficient audit trail     | `audit_logs` append-only, includes IP + event metadata                     | ✅ |
| Information leakage          | Global exception handler returns generic `Internal server error`           | ✅ |
| Sensitive data over wire     | Use HTTPS in production (handled by Emergent ingress)                      | ✅ |
| Account enumeration          | Login returns same generic message on missing user / bad password          | ✅ |
| Balance race conditions      | Atomic `$inc` with conditional `{$gte: amount}` filter                     | ✅ |
| Double-spend on withdrawal   | Balance held pre-approval; refunded on rejection                           | ✅ |
| KYC bypass                   | `kyc_status == verified` enforced on investments + withdrawals             | ✅ |
| Secret leakage in repo       | All secrets in `.env`, no hardcoding                                       | ✅ |

## Remaining Hardening for Production (Short term)
1. Move rate limiter from in-memory dict to **Redis** (multi-instance safe).
2. Add **CSRF double-submit cookie** pattern for state-changing endpoints when used from browser.
3. Set cookies to `secure=True` + `samesite=strict` in production.
4. Add **2FA / TOTP** for high-value accounts and admin role.
5. Rotate `JWT_SECRET` periodically; consider asymmetric `RS256` with key rotation.
6. Add **WAF / CDN** (Cloudflare) for DDoS shielding and bot filtering.
7. Integrate dedicated KYC provider (Sumsub / Persona) for liveness + document verification.
8. Add **PII encryption at rest** for `kyc_submissions` fields (Mongo Client-Side Field-Level Encryption).
9. Implement **anomaly detection** on withdrawal patterns (velocity rules).
10. Add **dependency scanning** (Dependabot / Snyk) and **SBOM** generation in CI.

## Compliance Considerations
- **KYC/AML**: enforced on invest + withdraw paths, decision audited.
- **Right to be forgotten (GDPR)**: add `/api/user/me` DELETE soft-delete + 30d retention purge.
- **Data localization**: production deployment should pin DB region per regulator (EEA / SG).
- **Audit retention**: keep `audit_logs` ≥ 7 years for financial regulators.
