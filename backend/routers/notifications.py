"""Notifications router — in-app notification feed."""
from fastapi import APIRouter, Depends, HTTPException
from core.db import db
from core.deps import get_current_user
from models.schemas import now_iso

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
async def list_notifications(user: dict = Depends(get_current_user), limit: int = 50):
    items = await db.notifications.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    unread = await db.notifications.count_documents({"user_id": user["id"], "read": False})
    return {"items": items, "unread": unread}


@router.post("/{notif_id}/read")
async def mark_read(notif_id: str, user: dict = Depends(get_current_user)):
    res = await db.notifications.update_one({"id": notif_id, "user_id": user["id"]}, {"$set": {"read": True, "read_at": now_iso()}})
    if res.matched_count == 0:
        raise HTTPException(404, "Notification not found")
    return {"ok": True}


@router.post("/read-all")
async def mark_all_read(user: dict = Depends(get_current_user)):
    await db.notifications.update_many({"user_id": user["id"], "read": False}, {"$set": {"read": True, "read_at": now_iso()}})
    return {"ok": True}
