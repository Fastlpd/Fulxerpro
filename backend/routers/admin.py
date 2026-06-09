"""Admin panel: users, analytics, audit logs."""
from fastapi import APIRouter, Depends
from core.db import db
from core.deps import require_admin

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", dependencies=[Depends(require_admin)])
async def list_users(limit: int = 200):
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).sort("created_at", -1).to_list(limit)
    return users


@router.get("/analytics", dependencies=[Depends(require_admin)])
async def analytics():
    total_users = await db.users.count_documents({})
    active_inv = await db.investments.count_documents({"status": "active"})
    pending_deposits = await db.transactions.count_documents({"type": "deposit", "status": "pending"})
    pending_withdrawals = await db.transactions.count_documents({"type": "withdrawal", "status": "pending"})

    # AUM = sum of active investments
    pipeline = [
        {"$match": {"status": "active"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
    ]
    agg = await db.investments.aggregate(pipeline).to_list(1)
    aum = agg[0]["total"] if agg else 0

    # Deposit/withdrawal volume (completed)
    dep_agg = await db.transactions.aggregate([
        {"$match": {"type": "deposit", "status": "completed"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
    ]).to_list(1)
    wd_agg = await db.transactions.aggregate([
        {"$match": {"type": "withdrawal", "status": "completed"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
    ]).to_list(1)

    return {
        "total_users": total_users,
        "active_investments": active_inv,
        "aum": aum,
        "deposit_volume": dep_agg[0]["total"] if dep_agg else 0,
        "withdrawal_volume": wd_agg[0]["total"] if wd_agg else 0,
        "pending_deposits": pending_deposits,
        "pending_withdrawals": pending_withdrawals,
    }


@router.get("/audit-logs", dependencies=[Depends(require_admin)])
async def audit_logs(limit: int = 100):
    logs = await db.audit_logs.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return logs
