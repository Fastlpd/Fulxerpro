"""KYC submission and admin review."""
from fastapi import APIRouter, Depends, HTTPException
from core.db import db
from core.deps import get_current_user, require_admin
from models.schemas import KYCSubmit, new_id, now_iso
from services.audit import log_event

router = APIRouter(prefix="/kyc", tags=["kyc"])


@router.post("/submit")
async def submit_kyc(payload: KYCSubmit, user: dict = Depends(get_current_user)):
    if user.get("kyc_status") == "verified":
        raise HTTPException(400, "Already verified")
    doc = {
        "id": new_id(),
        "user_id": user["id"],
        "status": "pending",
        "submitted_at": now_iso(),
        **payload.model_dump(),
    }
    await db.kyc_submissions.replace_one({"user_id": user["id"]}, doc, upsert=True)
    await db.users.update_one({"id": user["id"]}, {"$set": {"kyc_status": "pending"}})
    await log_event("kyc_submitted", user["id"])
    doc.pop("_id", None)
    return doc


@router.get("/status")
async def my_kyc(user: dict = Depends(get_current_user)):
    sub = await db.kyc_submissions.find_one({"user_id": user["id"]}, {"_id": 0})
    return {"status": user.get("kyc_status", "unverified"), "submission": sub}


@router.get("/pending", dependencies=[Depends(require_admin)])
async def list_pending_kyc():
    items = await db.kyc_submissions.find({"status": "pending"}, {"_id": 0}).to_list(500)
    return items


@router.post("/{user_id}/decision", dependencies=[Depends(require_admin)])
async def decide_kyc(user_id: str, decision: str):
    if decision not in ("approve", "reject"):
        raise HTTPException(400, "Invalid decision")
    new_status = "verified" if decision == "approve" else "rejected"
    await db.kyc_submissions.update_one({"user_id": user_id}, {"$set": {"status": new_status, "decided_at": now_iso()}})
    await db.users.update_one({"id": user_id}, {"$set": {"kyc_status": new_status}})
    await log_event(f"kyc_{decision}", user_id)
    return {"ok": True, "status": new_status}
