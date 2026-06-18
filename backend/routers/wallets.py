"""Wallets alias — exposes balance and recent ledger under /api/v1/wallets."""
from fastapi import APIRouter, Depends
from core.db import db
from core.deps import get_current_user

router = APIRouter(prefix="/wallets", tags=["wallets"])


@router.get("/me")
async def my_wallet(user: dict = Depends(get_current_user)):
    txs = await db.transactions.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(20)
    return {
        "user_id": user["id"],
        "balance": user.get("balance", 0.0),
        "currency": "USD",
        "recent_transactions": txs,
    }
