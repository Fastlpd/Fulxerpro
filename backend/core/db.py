"""MongoDB connection and indexes."""
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings

client = AsyncIOMotorClient(settings.MONGO_URL)
db = client[settings.DB_NAME]


async def init_indexes():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("referral_code", unique=True, sparse=True)
    await db.password_reset_tokens.create_index("expires_at", expireAfterSeconds=0)
    await db.login_attempts.create_index("identifier")
    await db.transactions.create_index([("user_id", 1), ("created_at", -1)])
    await db.investments.create_index([("user_id", 1), ("status", 1)])
    await db.audit_logs.create_index([("created_at", -1)])
    await db.plans.create_index("active")
    await db.assets.create_index([("category", 1), ("tier", 1), ("market_value", 1)])
    await db.user_asset_prefs.create_index([("user_id", 1), ("asset_id", 1)], unique=True)


def get_db():
    return db
