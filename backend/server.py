"""FulxerPro - production-grade FastAPI server entrypoint."""
from dotenv import load_dotenv
load_dotenv()

import logging
from fastapi import FastAPI, APIRouter, Request
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware

from core.config import settings
from core.db import db, init_indexes
from core.security import hash_password, verify_password
from models.schemas import new_id, now_iso, short_referral_code

from routers import auth, plans, investments, transactions, portfolio, referrals, kyc, admin, twofa, concierge
from services.scheduler import start_scheduler

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("fulxerpro")

app = FastAPI(title="FulxerPro API", version="1.0.0")

# /api/v1 root + legacy /api alias
api_v1 = APIRouter(prefix="/api/v1")
api_legacy = APIRouter(prefix="/api")

for r in [auth.router, plans.router, investments.router, transactions.router,
          portfolio.router, referrals.router, kyc.router, admin.router,
          twofa.router, concierge.router]:
    api_v1.include_router(r)
    api_legacy.include_router(r)


@api_legacy.get("/")
async def root():
    return {"service": "FulxerPro API", "version": "1.0.0", "status": "ok"}


@api_legacy.get("/health")
async def health():
    try:
        await db.command("ping")
        return {"status": "ok"}
    except Exception as e:
        return JSONResponse(status_code=503, content={"status": "error", "detail": str(e)})


app.include_router(api_v1)
app.include_router(api_legacy)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if settings.CORS_ORIGINS != ["*"] else ["*"],
    allow_credentials=True if settings.CORS_ORIGINS != ["*"] else False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler -> JSON
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error: %s", exc)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


async def seed_admin():
    existing = await db.users.find_one({"email": settings.ADMIN_EMAIL})
    if not existing:
        await db.users.insert_one({
            "id": new_id(),
            "email": settings.ADMIN_EMAIL,
            "name": "FulxerPro Admin",
            "password_hash": hash_password(settings.ADMIN_PASSWORD),
            "role": "admin",
            "kyc_status": "verified",
            "referral_code": short_referral_code(),
            "referred_by": None,
            "balance": 0.0,
            "created_at": now_iso(),
        })
        logger.info("Seeded admin user: %s", settings.ADMIN_EMAIL)
    elif not verify_password(settings.ADMIN_PASSWORD, existing["password_hash"]):
        await db.users.update_one(
            {"email": settings.ADMIN_EMAIL},
            {"$set": {"password_hash": hash_password(settings.ADMIN_PASSWORD), "role": "admin"}},
        )
        logger.info("Updated admin password from env")


async def seed_plans():
    count = await db.plans.count_documents({})
    if count > 0:
        return
    starter_plans = [
        {"id": new_id(), "name": "Starter Yield", "description": "Conservative entry-level plan with stable returns.", "roi_percent": 6.0, "duration_days": 30, "min_amount": 100, "max_amount": 999, "risk_level": "low", "active": True, "created_at": now_iso()},
        {"id": new_id(), "name": "Growth Index", "description": "Balanced exposure across digital & traditional assets.", "roi_percent": 12.0, "duration_days": 60, "min_amount": 1000, "max_amount": 9999, "risk_level": "medium", "active": True, "created_at": now_iso()},
        {"id": new_id(), "name": "Alpha Capital", "description": "Aggressive plan targeting high-conviction opportunities.", "roi_percent": 22.0, "duration_days": 90, "min_amount": 10000, "max_amount": 100000, "risk_level": "high", "active": True, "created_at": now_iso()},
        {"id": new_id(), "name": "Institutional Reserve", "description": "Premium plan for accredited investors.", "roi_percent": 35.0, "duration_days": 180, "min_amount": 50000, "max_amount": 1000000, "risk_level": "high", "active": True, "created_at": now_iso()},
    ]
    await db.plans.insert_many(starter_plans)
    logger.info("Seeded %d investment plans", len(starter_plans))


@app.on_event("startup")
async def startup():
    await init_indexes()
    await seed_admin()
    await seed_plans()
    start_scheduler()
    logger.info("FulxerPro API ready")


@app.on_event("shutdown")
async def shutdown():
    pass
