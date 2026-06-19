"""Investments: user invests in a plan; matured investments credit balance."""
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone, timedelta
from core.db import db
from core.deps import get_current_user
from models.schemas import InvestmentCreate, new_id, now_iso
from services.audit import log_event


router = APIRouter(prefix="/investments", tags=["investments"])


@router.post("")
async def create_investment(payload: InvestmentCreate, user: dict = Depends(get_current_user)):
    plan = await db.plans.find_one({"id": payload.plan_id, "active": True})
    if not plan:
        raise HTTPException(404, "Plan not available")
    if payload.amount < plan["min_amount"] or payload.amount > plan["max_amount"]:
        raise HTTPException(400, f"Amount must be between {plan['min_amount']} and {plan['max_amount']}")
    if user.get("kyc_status") != "verified":
        raise HTTPException(403, "KYC verification required before investing")

    # Atomic balance debit (only if sufficient balance)
    res = await db.users.update_one(
        {"id": user["id"], "balance": {"$gte": payload.amount}},
        {"$inc": {"balance": -payload.amount}},
    )
    if res.modified_count == 0:
        raise HTTPException(400, "Insufficient balance")

    now = datetime.now(timezone.utc)
    matures = now + timedelta(days=plan["duration_days"])
    expected_return = round(payload.amount * (1 + plan["roi_percent"] / 100), 2)

    inv = {
        "id": new_id(),
        "user_id": user["id"],
        "plan_id": plan["id"],
        "plan_name": plan["name"],
        "amount": payload.amount,
        "roi_percent": plan["roi_percent"],
        "duration_days": plan["duration_days"],
        "expected_return": expected_return,
        "status": "active",
        "started_at": now.isoformat(),
        "matures_at": matures.isoformat(),
    }
    await db.investments.insert_one(inv)

    # Record ledger transaction
    await db.transactions.insert_one({
        "id": new_id(),
        "user_id": user["id"],
        "type": "investment",
        "amount": payload.amount,
        "status": "completed",
        "reference": inv["id"],
        "created_at": now.isoformat(),
    })

    await log_event("investment_created", user["id"], None, {"investment_id": inv["id"], "amount": payload.amount})
    inv.pop("_id", None)
    return inv


@router.get("")
async def list_investments(user: dict = Depends(get_current_user)):
    items = await db.investments.find({"user_id": user["id"]}, {"_id": 0}).sort("started_at", -1).to_list(500)
    return items
