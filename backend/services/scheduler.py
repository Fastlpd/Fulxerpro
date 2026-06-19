"""APScheduler background jobs — mature investments, send reminders."""
import logging
from datetime import datetime, timezone
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from core.db import db
from services.email import send_email, tpl_investment_matured
from services.audit import log_event

logger = logging.getLogger("fulxerpro.scheduler")
scheduler = AsyncIOScheduler(timezone="UTC")


async def mature_investments_job():
    """Find investments past their maturity, credit return to user balance, mark matured."""
    now = datetime.now(timezone.utc).isoformat()
    cursor = db.investments.find({"status": "active", "matures_at": {"$lte": now}})
    matured = 0
    async for inv in cursor:
        await db.users.update_one({"id": inv["user_id"]}, {"$inc": {"balance": inv["expected_return"]}})
        await db.investments.update_one({"id": inv["id"]}, {"$set": {"status": "matured", "matured_at": now}})
        await db.transactions.insert_one({
            "id": f"mat_{inv['id']}",
            "user_id": inv["user_id"],
            "type": "maturity",
            "amount": inv["expected_return"],
            "status": "completed",
            "reference": inv["id"],
            "created_at": now,
        })
        user = await db.users.find_one({"id": inv["user_id"]})
        if user:
            subject, html = tpl_investment_matured(user["name"], inv["plan_name"], inv["amount"], inv["expected_return"])
            await send_email(user["email"], subject, html)
        await log_event("investment_matured", inv["user_id"], None, {"investment_id": inv["id"], "payout": inv["expected_return"]})
        matured += 1
    if matured:
        logger.info("Matured %d investment(s)", matured)


def start_scheduler():
    if scheduler.running:
        return
    # Run every 10 minutes — production should run hourly or daily
    scheduler.add_job(mature_investments_job, "interval", minutes=10, id="mature_investments", replace_existing=True)
    scheduler.start()
    logger.info("Scheduler started — maturity job every 10 minutes")
