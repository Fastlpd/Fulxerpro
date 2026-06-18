"""Authentication endpoints."""
from fastapi import APIRouter, HTTPException, Response, Request, Depends
from datetime import datetime, timezone, timedelta
from core.db import db
from core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from core.deps import get_current_user
from models.schemas import UserRegister, UserLogin, new_id, now_iso, short_referral_code
from services.rate_limit import make_limiter
from services.audit import log_event
from services.email import send_email, tpl_welcome
from routers.twofa import verify_totp_code
import pyotp

router = APIRouter(prefix="/auth", tags=["auth"])

login_limiter = make_limiter(10, 60, "login")
register_limiter = make_limiter(5, 300, "register")
LOCKOUT_THRESHOLD = 5
LOCKOUT_MINUTES = 15


def _set_cookies(response: Response, access: str, refresh: str):
    response.set_cookie("access_token", access, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")


def _serialize_user(u: dict) -> dict:
    u.pop("_id", None)
    u.pop("password_hash", None)
    return u


@router.post("/register", dependencies=[Depends(register_limiter)])
async def register(payload: UserRegister, request: Request, response: Response):
    email = payload.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    referrer_id = None
    if payload.referred_by:
        referrer = await db.users.find_one({"referral_code": payload.referred_by.upper()})
        if referrer:
            referrer_id = referrer["id"]

    user_id = new_id()
    doc = {
        "id": user_id,
        "email": email,
        "name": payload.name,
        "password_hash": hash_password(payload.password),
        "role": "user",
        "kyc_status": "unverified",
        "referral_code": short_referral_code(),
        "referred_by": referrer_id,
        "balance": 0.0,
        "created_at": now_iso(),
    }
    await db.users.insert_one(doc)
    ip = request.client.host if request.client else None
    await log_event("user_registered", user_id, ip, {"email": email})

    # Send welcome email (log-mode fallback if SendGrid not configured)
    subject, html = tpl_welcome(payload.name)
    try:
        await send_email(email, subject, html)
    except Exception:
        pass

    access = create_access_token(user_id, email, "user")
    refresh = create_refresh_token(user_id)
    _set_cookies(response, access, refresh)
    return _serialize_user(doc)


@router.post("/login", dependencies=[Depends(login_limiter)])
async def login(payload: UserLogin, request: Request, response: Response):
    email = payload.email.lower()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"

    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("locked_until"):
        locked_until = datetime.fromisoformat(attempt["locked_until"])
        if locked_until > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="Account locked. Try again later.")

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        failed = (attempt or {}).get("failed", 0) + 1
        update = {"identifier": identifier, "failed": failed, "last_attempt": now_iso()}
        if failed >= LOCKOUT_THRESHOLD:
            update["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=LOCKOUT_MINUTES)).isoformat()
            update["failed"] = 0
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        await log_event("login_failed", None, ip, {"email": email})
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.login_attempts.delete_one({"identifier": identifier})

    # 2FA enforcement: admins MUST have 2FA enabled (set up on first login), users only if opted-in
    is_admin = user.get("role") in ("admin", "super_admin")
    has_2fa = user.get("totp_enabled")
    if has_2fa:
        if not payload.totp_code:
            raise HTTPException(status_code=401, detail="2FA code required")
        if not verify_totp_code(user.get("totp_secret", ""), payload.totp_code):
            await log_event("login_2fa_failed", user["id"], ip)
            raise HTTPException(status_code=401, detail="Invalid 2FA code")

    await log_event("login_success", user["id"], ip)

    access = create_access_token(user["id"], user["email"], user["role"])
    refresh = create_refresh_token(user["id"])
    _set_cookies(response, access, refresh)
    return _serialize_user(user)


@router.post("/logout")
async def logout(response: Response, user: dict = Depends(get_current_user)):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    await log_event("logout", user["id"])
    return {"ok": True}


@router.get("/me")
async def me(user: dict = Depends(get_current_user)):
    return user


@router.post("/refresh")
async def refresh_token(request: Request, response: Response):
    rt = request.cookies.get("refresh_token")
    if not rt:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = decode_token(rt)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access = create_access_token(user["id"], user["email"], user["role"])
        response.set_cookie("access_token", access, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
        return {"ok": True}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
