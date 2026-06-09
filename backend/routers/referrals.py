"""Referrals: link, stats, downstream list."""
from fastapi import APIRouter, Depends
from core.db import db
from core.deps import get_current_user

router = APIRouter(prefix="/referrals", tags=["referrals"])


@router.get("/me")
async def my_referrals(user: dict = Depends(get_current_user)):
    referred = await db.users.find({"referred_by": user["id"]}, {"_id": 0, "password_hash": 0}).to_list(500)
    # Earnings = 5% of referred users' total invested
    total_earnings = 0.0
    referred_summary = []
    for r in referred:
        invs = await db.investments.find({"user_id": r["id"]}).to_list(1000)
        invested = sum(i["amount"] for i in invs)
        earned = round(invested * 0.05, 2)
        total_earnings += earned
        referred_summary.append({
            "id": r["id"],
            "name": r["name"],
            "email": r["email"],
            "joined": r["created_at"],
            "invested": invested,
            "earned": earned,
        })
    return {
        "referral_code": user["referral_code"],
        "referral_count": len(referred),
        "total_earnings": round(total_earnings, 2),
        "referred_users": referred_summary,
    }
