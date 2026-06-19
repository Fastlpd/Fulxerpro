"""Settings router — user profile prefs + notification toggles."""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from core.db import db
from core.deps import get_current_user
from models.schemas import now_iso

router = APIRouter(prefix="/settings", tags=["settings"])


class SettingsUpdate(BaseModel):
    email_notifications: Optional[bool] = None
    marketing_emails: Optional[bool] = None
    timezone: Optional[str] = None
    currency: Optional[str] = None
    risk_appetite: Optional[str] = None  # conservative / balanced / aggressive


@router.get("/me")
async def get_settings(user: dict = Depends(get_current_user)):
    settings = await db.user_settings.find_one({"user_id": user["id"]}, {"_id": 0})
    if not settings:
        settings = {
            "user_id": user["id"],
            "email_notifications": True,
            "marketing_emails": False,
            "timezone": "UTC",
            "currency": "USD",
            "risk_appetite": "balanced",
        }
    return settings


@router.patch("/me")
async def update_settings(payload: SettingsUpdate, user: dict = Depends(get_current_user)):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update:
        return await get_settings(user)
    update["user_id"] = user["id"]
    update["updated_at"] = now_iso()
    await db.user_settings.update_one({"user_id": user["id"]}, {"$set": update}, upsert=True)
    return await db.user_settings.find_one({"user_id": user["id"]}, {"_id": 0})
