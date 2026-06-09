"""Deposits, withdrawals, transaction history."""
from fastapi import APIRouter, Depends, HTTPException
from core.db import db
from core.deps import get_current_user, require_admin
from models.schemas import DepositCreate, WithdrawalCreate, TransactionDecision, new_id, now_iso
from services.audit import log_event

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("")
async def list_my_transactions(user: dict = Depends(get_current_user), limit: int = 100):
    items = await db.transactions.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return items


@router.post("/deposit")
async def request_deposit(payload: DepositCreate, user: dict = Depends(get_current_user)):
    if payload.amount < 10:
        raise HTTPException(400, "Minimum deposit is 10")
    doc = {
        "id": new_id(),
        "user_id": user["id"],
        "type": "deposit",
        "amount": payload.amount,
        "method": payload.method,
        "reference": payload.reference,
        "status": "pending",
        "created_at": now_iso(),
    }
    await db.transactions.insert_one(doc)
    await log_event("deposit_requested", user["id"], None, {"amount": payload.amount, "method": payload.method})
    doc.pop("_id", None)
    return doc


@router.post("/withdraw")
async def request_withdrawal(payload: WithdrawalCreate, user: dict = Depends(get_current_user)):
    if user.get("kyc_status") != "verified":
        raise HTTPException(403, "KYC verification required for withdrawals")
    if payload.amount < 10:
        raise HTTPException(400, "Minimum withdrawal is 10")

    # Atomic balance hold
    res = await db.users.update_one(
        {"id": user["id"], "balance": {"$gte": payload.amount}},
        {"$inc": {"balance": -payload.amount}},
    )
    if res.modified_count == 0:
        raise HTTPException(400, "Insufficient balance")

    doc = {
        "id": new_id(),
        "user_id": user["id"],
        "type": "withdrawal",
        "amount": payload.amount,
        "method": payload.method,
        "destination": payload.destination,
        "status": "pending",
        "created_at": now_iso(),
    }
    await db.transactions.insert_one(doc)
    await log_event("withdrawal_requested", user["id"], None, {"amount": payload.amount})
    doc.pop("_id", None)
    return doc


# ============ Admin approval flows ============
@router.get("/pending", dependencies=[Depends(require_admin)])
async def list_pending():
    items = await db.transactions.find(
        {"status": "pending", "type": {"$in": ["deposit", "withdrawal"]}}, {"_id": 0}
    ).sort("created_at", -1).to_list(500)
    return items


@router.post("/{tx_id}/decision")
async def decide_transaction(tx_id: str, payload: TransactionDecision, admin: dict = Depends(require_admin)):
    tx = await db.transactions.find_one({"id": tx_id})
    if not tx:
        raise HTTPException(404, "Transaction not found")
    if tx["status"] != "pending":
        raise HTTPException(400, "Transaction already processed")

    new_status = "completed" if payload.decision == "approve" else "rejected"

    if payload.decision == "approve" and tx["type"] == "deposit":
        await db.users.update_one({"id": tx["user_id"]}, {"$inc": {"balance": tx["amount"]}})
    elif payload.decision == "reject" and tx["type"] == "withdrawal":
        # refund the held balance
        await db.users.update_one({"id": tx["user_id"]}, {"$inc": {"balance": tx["amount"]}})

    await db.transactions.update_one(
        {"id": tx_id},
        {"$set": {"status": new_status, "decided_by": admin["id"], "decided_at": now_iso(), "decision_note": payload.note}},
    )
    await log_event(f"tx_{payload.decision}", admin["id"], None, {"tx_id": tx_id, "type": tx["type"]})
    return {"ok": True, "status": new_status}
