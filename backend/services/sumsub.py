"""Sumsub KYC integration — sandbox mock mode by default.
Replace with real Sumsub SDK calls when SUMSUB_MODE=live and tokens are present.
Docs: https://docs.sumsub.com/reference/about-sumsub-api
"""
import os
import hashlib
import hmac
import time
import uuid
from typing import Optional


def is_live() -> bool:
    return os.environ.get("SUMSUB_MODE", "mock").lower() == "live" and bool(os.environ.get("SUMSUB_APP_TOKEN"))


async def generate_access_token(user_id: str, level_name: str = "basic-kyc-level") -> dict:
    """Returns a Sumsub access token the frontend SDK uses to open the verification flow."""
    if not is_live():
        # MOCK: return a deterministic fake token
        return {
            "token": f"mock_sumsub_token_{user_id}_{uuid.uuid4().hex[:8]}",
            "user_id": user_id,
            "level": level_name,
            "expires_in": 600,
            "mode": "mock",
        }
    # LIVE: real signed call would go here
    raise NotImplementedError("Live Sumsub mode requires production API integration")


def verify_webhook_signature(payload: bytes, signature: str) -> bool:
    """Verify Sumsub webhook X-Payload-Digest header (HMAC-SHA256)."""
    if not is_live():
        return True  # mock accepts all
    secret = os.environ.get("SUMSUB_SECRET_KEY", "").encode()
    expected = hmac.new(secret, payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature or "")


def parse_webhook_event(payload: dict) -> Optional[dict]:
    """Normalize Sumsub webhook into our internal shape."""
    review_status = payload.get("reviewStatus")
    review_result = (payload.get("reviewResult") or {}).get("reviewAnswer")
    user_id = payload.get("externalUserId")
    if not user_id:
        return None
    if review_status == "completed" and review_result == "GREEN":
        return {"user_id": user_id, "status": "verified"}
    if review_status == "completed" and review_result == "RED":
        return {"user_id": user_id, "status": "rejected"}
    return {"user_id": user_id, "status": "pending"}
