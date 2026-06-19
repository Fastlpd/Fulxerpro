"""TOTP 2FA via pyotp — required for admin, optional for users."""
import pyotp
import qrcode
import io
import base64
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from core.db import db
from core.deps import get_current_user
from services.audit import log_event

router = APIRouter(prefix="/2fa", tags=["2fa"])


class VerifyCode(BaseModel):
    code: str


@router.post("/setup")
async def setup_2fa(user: dict = Depends(get_current_user)):
    """Generate a TOTP secret + provisioning URI + QR code (base64 PNG)."""
    if user.get("totp_enabled"):
        raise HTTPException(400, "2FA already enabled — disable first to re-enroll")
    secret = pyotp.random_base32()
    uri = pyotp.totp.TOTP(secret).provisioning_uri(name=user["email"], issuer_name="FulxerPro")

    img = qrcode.make(uri)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    qr_b64 = base64.b64encode(buf.getvalue()).decode()

    # Stage the secret (not enabled until verify confirms)
    await db.users.update_one({"id": user["id"]}, {"$set": {"totp_secret_pending": secret}})
    return {"secret": secret, "qr_code": f"data:image/png;base64,{qr_b64}", "uri": uri}


@router.post("/verify")
async def verify_and_enable(payload: VerifyCode, user: dict = Depends(get_current_user)):
    full_user = await db.users.find_one({"id": user["id"]})
    secret = full_user.get("totp_secret_pending")
    if not secret:
        raise HTTPException(400, "No pending 2FA setup. Call /2fa/setup first.")
    if not pyotp.TOTP(secret).verify(payload.code, valid_window=1):
        raise HTTPException(400, "Invalid code")
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"totp_enabled": True, "totp_secret": secret}, "$unset": {"totp_secret_pending": ""}},
    )
    await log_event("2fa_enabled", user["id"])
    return {"ok": True, "enabled": True}


@router.post("/disable")
async def disable_2fa(payload: VerifyCode, user: dict = Depends(get_current_user)):
    if user.get("role") in ("admin", "super_admin"):
        raise HTTPException(403, "Admins cannot disable 2FA")
    full_user = await db.users.find_one({"id": user["id"]})
    if not full_user.get("totp_enabled"):
        raise HTTPException(400, "2FA not enabled")
    if not pyotp.TOTP(full_user["totp_secret"]).verify(payload.code, valid_window=1):
        raise HTTPException(400, "Invalid code")
    await db.users.update_one({"id": user["id"]}, {"$set": {"totp_enabled": False}, "$unset": {"totp_secret": ""}})
    await log_event("2fa_disabled", user["id"])
    return {"ok": True}


@router.get("/status")
async def my_2fa_status(user: dict = Depends(get_current_user)):
    full_user = await db.users.find_one({"id": user["id"]})
    return {
        "enabled": bool(full_user.get("totp_enabled")),
        "required": user.get("role") in ("admin", "super_admin"),
    }


def verify_totp_code(secret: str, code: str) -> bool:
    if not secret or not code:
        return False
    return pyotp.TOTP(secret).verify(code, valid_window=1)
