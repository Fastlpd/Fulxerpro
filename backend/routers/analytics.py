"""Analytics alias — exposes admin analytics summary at /api/v1/analytics for dashboards."""
from fastapi import APIRouter, Depends
from core.db import db
from core.deps import require_admin

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/overview", dependencies=[Depends(require_admin)])
async def overview():
    from routers.admin import analytics as admin_analytics
    return await admin_analytics()


@router.get("/timeseries", dependencies=[Depends(require_admin)])
async def timeseries(days: int = 30):
    """Returns daily aggregates of registrations, deposits, withdrawals (last N days)."""
    pipeline_users = [
        {"$group": {"_id": {"$substr": ["$created_at", 0, 10]}, "count": {"$sum": 1}}},
        {"$sort": {"_id": -1}},
        {"$limit": days},
    ]
    users_ts = await db.users.aggregate(pipeline_users).to_list(days)

    pipeline_deposits = [
        {"$match": {"type": "deposit", "status": "completed"}},
        {"$group": {"_id": {"$substr": ["$created_at", 0, 10]}, "amount": {"$sum": "$amount"}, "count": {"$sum": 1}}},
        {"$sort": {"_id": -1}},
        {"$limit": days},
    ]
    deposits_ts = await db.transactions.aggregate(pipeline_deposits).to_list(days)

    return {
        "users_by_day": users_ts,
        "deposits_by_day": deposits_ts,
    }
