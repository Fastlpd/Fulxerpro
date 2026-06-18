"""Users alias router — public profile endpoints under /api/v1/users."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from core.db import db
from core.deps import get_current_user
from models.schemas import now_iso

router = APIRouter(prefix="/users", tags=["users"])


class ProfileUpdate(BaseModel):
    name: Optional[str] = None


@router.get("/me")
async def me(user: dict = Depends(get_current_user)):
    return user


@router.patch("/me")
async def update_profile(payload: ProfileUpdate, user: dict = Depends(get_current_user)):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if update:
        update["updated_at"] = now_iso()
        await db.users.update_one({"id": user["id"]}, {"$set": update})
    u = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0, "totp_secret": 0, "totp_secret_pending": 0})
    return u
