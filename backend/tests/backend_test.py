"""FulxerPro backend integration tests"""
import os
import uuid
import time
import pytest
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL", "https://platform-overhaul-7.preview.emergentagent.com").rstrip("/")
API = f"{BASE}/api"

ADMIN_EMAIL = "admin@fulxerpro.com"
ADMIN_PASSWORD = "Admin@12345"


def _new_email(prefix="testuser"):
    return f"TEST_{prefix}_{uuid.uuid4().hex[:8]}@user.com"


@pytest.fixture(scope="session")
def admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return s


@pytest.fixture(scope="session")
def user_session():
    s = requests.Session()
    email = _new_email("primary")
    r = s.post(f"{API}/auth/register", json={"email": email, "password": "Test@12345", "name": "Primary User"})
    assert r.status_code in (200, 201), f"Register failed: {r.status_code} {r.text}"
    s.email = email  # type: ignore
    return s


# ---------------- Health & Auth ----------------

def test_health():
    r = requests.get(f"{API}/health")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


def test_register_returns_user_no_password_hash():
    s = requests.Session()
    email = _new_email("reg")
    r = s.post(f"{API}/auth/register", json={"email": email, "password": "Test@12345", "name": "Reg User"})
    assert r.status_code in (200, 201), r.text
    data = r.json()
    # accept either {user:{...}} or flat user
    u = data.get("user", data)
    assert "password_hash" not in u and "password" not in u
    assert u.get("email", "").lower() == email.lower()
    # Cookies set
    assert any(c.name in ("access_token", "refresh_token") for c in s.cookies), f"No auth cookies set: {s.cookies}"


def test_admin_login_and_me(admin_session):
    r = admin_session.get(f"{API}/auth/me")
    assert r.status_code == 200, r.text
    u = r.json().get("user", r.json())
    assert u.get("email") == ADMIN_EMAIL
    assert u.get("role") == "admin"


def test_logout_clears_cookies():
    s = requests.Session()
    email = _new_email("logout")
    s.post(f"{API}/auth/register", json={"email": email, "password": "Test@12345", "name": "Logout User"})
    r = s.post(f"{API}/auth/logout")
    assert r.status_code in (200, 204)
    me = s.get(f"{API}/auth/me")
    assert me.status_code in (401, 403)


def test_brute_force_lockout():
    # Use a fresh user
    email = _new_email("brute")
    requests.post(f"{API}/auth/register", json={"email": email, "password": "Test@12345", "name": "BF"})
    got_429 = False
    last_code = None
    for i in range(8):
        r = requests.post(f"{API}/auth/login", json={"email": email, "password": "WrongPassword!"})
        last_code = r.status_code
        if r.status_code == 429:
            got_429 = True
            break
    assert got_429, f"Expected 429 after multiple bad logins, last={last_code}"


# ---------------- Plans ----------------

def test_plans_seeded():
    r = requests.get(f"{API}/plans")
    assert r.status_code == 200
    plans = r.json()
    if isinstance(plans, dict):
        plans = plans.get("plans", plans.get("data", []))
    assert isinstance(plans, list)
    assert len(plans) >= 4, f"Expected >=4 plans, got {len(plans)}"


def test_user_cannot_create_plan(user_session):
    r = user_session.post(f"{API}/plans", json={"name": "x", "min_amount": 1, "roi_percent": 1, "duration_days": 1})
    assert r.status_code in (401, 403)


# ---------------- KYC + Investments ----------------

def test_invest_without_kyc_forbidden(user_session):
    plans = requests.get(f"{API}/plans").json()
    if isinstance(plans, dict):
        plans = plans.get("plans", plans.get("data", []))
    pid = plans[0].get("id") or plans[0].get("_id")
    r = user_session.post(f"{API}/investments", json={"plan_id": pid, "amount": plans[0].get("min_amount", 100)})
    assert r.status_code == 403, f"Expected 403 without KYC, got {r.status_code} {r.text}"


def test_withdraw_without_kyc_forbidden(user_session):
    r = user_session.post(f"{API}/transactions/withdraw", json={"amount": 10, "method": "bank_transfer", "destination": "acct12345"})
    assert r.status_code == 403, f"got {r.status_code}: {r.text}"


def test_kyc_submit_and_approve(admin_session):
    # New user
    s = requests.Session()
    email = _new_email("kyc")
    s.post(f"{API}/auth/register", json={"email": email, "password": "Test@12345", "name": "KYC User"})

    r = s.post(f"{API}/kyc/submit", json={
        "full_legal_name": "KYC User",
        "date_of_birth": "1990-01-01",
        "document_type": "passport",
        "document_number": "X123456",
        "address": "123 Main St, City",
        "country": "US"
    })
    assert r.status_code in (200, 201), r.text

    status = s.get(f"{API}/kyc/status")
    assert status.status_code == 200
    sjson = status.json()
    assert sjson.get("kyc_status", sjson.get("status")) in ("pending", "submitted")

    # admin approve - need user_id
    me = s.get(f"{API}/auth/me").json()
    uid = me.get("user", me).get("id") or me.get("user", me).get("_id")

    pending = admin_session.get(f"{API}/kyc/pending")
    assert pending.status_code == 200

    dec = admin_session.post(f"{API}/kyc/{uid}/decision", params={"decision": "approve"})
    assert dec.status_code in (200, 204), dec.text

    status2 = s.get(f"{API}/kyc/status")
    s2 = status2.json()
    assert s2.get("kyc_status", s2.get("status")) == "verified"


def test_deposit_approve_credits_balance(admin_session):
    s = requests.Session()
    email = _new_email("dep")
    s.post(f"{API}/auth/register", json={"email": email, "password": "Test@12345", "name": "Dep"})

    r = s.post(f"{API}/transactions/deposit", json={"amount": 500, "method": "bank_transfer", "reference": "TX1"})
    assert r.status_code in (200, 201), r.text
    tx = r.json()
    tx_id = tx.get("id") or tx.get("_id") or tx.get("transaction", {}).get("id")
    assert tx_id, f"No tx id: {tx}"

    # Admin approves
    dec = admin_session.post(f"{API}/transactions/{tx_id}/decision", json={"decision": "approve"})
    assert dec.status_code in (200, 204), dec.text

    me = s.get(f"{API}/auth/me").json()
    u = me.get("user", me)
    assert u.get("balance", 0) >= 500, f"Balance not credited: {u.get('balance')}"


# ---------------- Portfolio / Referrals ----------------

def test_portfolio_summary(user_session):
    r = user_session.get(f"{API}/portfolio/summary")
    assert r.status_code == 200
    d = r.json()
    for key in ("balance", "total_invested", "expected_return"):
        assert key in d, f"missing key {key} in {d}"


def test_referrals_me(user_session):
    r = user_session.get(f"{API}/referrals/me")
    assert r.status_code == 200
    d = r.json()
    assert "referral_code" in d
    assert "count" in d or "referrals_count" in d or "total_referrals" in d or "referral_count" in d


# ---------------- RBAC ----------------

@pytest.mark.parametrize("path", [
    "/admin/analytics",
    "/admin/users",
    "/admin/audit-logs",
    "/transactions/pending",
    "/kyc/pending",
])
def test_admin_endpoints_require_admin(user_session, path):
    r = user_session.get(f"{API}{path}")
    assert r.status_code == 403, f"{path} returned {r.status_code} for non-admin"


def test_admin_endpoints_work_for_admin(admin_session):
    for p in ["/admin/analytics", "/admin/users", "/admin/audit-logs"]:
        r = admin_session.get(f"{API}{p}")
        assert r.status_code == 200, f"{p} failed: {r.status_code} {r.text[:200]}"


# ---------------- Validation ----------------

def test_deposit_validation_negative_amount(user_session):
    r = user_session.post(f"{API}/transactions/deposit", json={"amount": -5, "method": "bank_transfer"})
    assert r.status_code in (400, 422)


def test_register_missing_fields():
    r = requests.post(f"{API}/auth/register", json={"email": "noPass@x.com"})
    # 422 (validation) or 429 (rate-limit) both acceptable; the point is no 200
    assert r.status_code in (400, 422, 429)
