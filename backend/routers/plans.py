"""Investment plans (public list + admin CRUD)."""
from fastapi import APIRouter, Depends, HTTPException
from core.db import db
from core.deps import get_current_user, require_admin
from models.schemas import PlanCreate, new_id, now_iso

router = APIRouter(prefix="/plans", tags=["plans"])


@router.get("")
async def list_plans():
    plans = await db.plans.find({"active": True}, {"_id": 0}).to_list(200)
    return plans


@router.get("/all", dependencies=[Depends(require_admin)])
async def list_all_plans():
    plans = await db.plans.find({}, {"_id": 0}).to_list(500)
    return plans


@router.post("", dependencies=[Depends(require_admin)])
async def create_plan(payload: PlanCreate):
    if payload.max_amount < payload.min_amount:
        raise HTTPException(400, "max_amount must be >= min_amount")
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["created_at"] = now_iso()
    await db.plans.insert_one(doc)
    doc.pop("_id", None)
    return doc


@router.patch("/{plan_id}", dependencies=[Depends(require_admin)])
async def update_plan(plan_id: str, payload: PlanCreate):
    res = await db.plans.update_one({"id": plan_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(404, "Plan not found")
    plan = await db.plans.find_one({"id": plan_id}, {"_id": 0})
    return plan


@router.delete("/{plan_id}", dependencies=[Depends(require_admin)])
async def delete_plan(plan_id: str):
    res = await db.plans.update_one({"id": plan_id}, {"$set": {"active": False}})
    if res.matched_count == 0:
        raise HTTPException(404, "Plan not found")
    return {"ok": True}
