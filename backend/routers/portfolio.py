"""Portfolio summary."""
from fastapi import APIRouter, Depends
from core.db import db
from core.deps import get_current_user

router = APIRouter(prefix="/portfolio", tags=["portfolio"])


@router.get("/summary")
async def summary(user: dict = Depends(get_current_user)):
    invs = await db.investments.find({"user_id": user["id"]}, {"_id": 0}).to_list(1000)
    txs = await db.transactions.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(20)

    active = [i for i in invs if i["status"] == "active"]
    total_invested = sum(i["amount"] for i in active)
    expected_return = sum(i["expected_return"] for i in active)
    total_earnings = sum(i["expected_return"] - i["amount"] for i in invs if i["status"] == "matured")

    # Allocation by plan name
    allocation = {}
    for i in active:
        allocation[i["plan_name"]] = allocation.get(i["plan_name"], 0) + i["amount"]
    allocation_list = [{"name": k, "value": v} for k, v in allocation.items()]

    return {
        "balance": user.get("balance", 0.0),
        "total_invested": total_invested,
        "expected_return": expected_return,
        "total_earnings": total_earnings,
        "active_count": len(active),
        "allocation": allocation_list,
        "recent_transactions": txs[:10],
    }
