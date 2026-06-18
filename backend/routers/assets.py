"""Asset Investment Marketplace — Housing, Vehicles, Cameras.

Public list + tier filter + per-user favorites/goals + growth projection.
Market values are static reference estimates and clearly labeled — never guaranteed.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, Literal
from core.db import db
from core.deps import get_current_user
from models.schemas import new_id, now_iso

router = APIRouter(prefix="/assets", tags=["assets"])


class GoalBody(BaseModel):
    target_months: int = Field(ge=1, le=120, default=24)
    monthly_contribution: float = Field(ge=0, default=500)


class ProjectionQuery(BaseModel):
    monthly_contribution: float = 500.0
    annual_return_pct: float = 16.2
    months: list[int] = [3, 6, 12, 24, 36]


# ---------- LIST / FILTER ----------
@router.get("")
async def list_assets(
    category: Optional[Literal["housing", "vehicles", "cameras"]] = None,
    tier: Optional[str] = None,
    user: dict = Depends(get_current_user),
):
    q = {}
    if category:
        q["category"] = category
    if tier:
        q["tier"] = tier
    assets = await db.assets.find(q, {"_id": 0}).sort([("category", 1), ("market_value", 1)]).to_list(500)

    # Annotate with user prefs (favorite + goal)
    prefs = await db.user_asset_prefs.find({"user_id": user["id"]}, {"_id": 0}).to_list(1000)
    pref_map = {p["asset_id"]: p for p in prefs}
    for a in assets:
        p = pref_map.get(a["id"], {})
        a["is_favorite"] = bool(p.get("is_favorite"))
        a["is_goal"] = bool(p.get("is_goal"))
    return assets


@router.get("/categories")
async def categories():
    return {
        "housing": ["entry", "mid", "premium", "luxury"],
        "vehicles": ["economy", "mid", "premium", "luxury"],
        "cameras": ["beginner", "creator", "professional", "studio_elite"],
    }


# ---------- DETAIL ----------
@router.get("/{asset_id}")
async def get_asset(asset_id: str, user: dict = Depends(get_current_user)):
    a = await db.assets.find_one({"id": asset_id}, {"_id": 0})
    if not a:
        raise HTTPException(404, "Asset not found")
    pref = await db.user_asset_prefs.find_one({"user_id": user["id"], "asset_id": asset_id}, {"_id": 0}) or {}
    a["is_favorite"] = bool(pref.get("is_favorite"))
    a["is_goal"] = bool(pref.get("is_goal"))
    a["goal_target_months"] = pref.get("target_months")
    a["goal_monthly_contribution"] = pref.get("monthly_contribution")
    return a


# ---------- PROJECTION ENGINE ----------
def _future_value(starting: float, monthly: float, months: int, annual_pct: float) -> float:
    """FV of starting principal + monthly contributions, compounded monthly."""
    r = annual_pct / 100.0 / 12.0
    fv_principal = starting * ((1 + r) ** months)
    if r == 0:
        fv_contributions = monthly * months
    else:
        fv_contributions = monthly * (((1 + r) ** months - 1) / r)
    return round(fv_principal + fv_contributions, 2)


@router.get("/{asset_id}/projection")
async def projection(
    asset_id: str,
    monthly_contribution: float = Query(500.0, ge=0),
    annual_return_pct: float = Query(16.2, ge=0, le=100),
    user: dict = Depends(get_current_user),
):
    a = await db.assets.find_one({"id": asset_id}, {"_id": 0})
    if not a:
        raise HTTPException(404, "Asset not found")

    starting = float(user.get("balance", 0))
    target = float(a["market_value"])
    months_grid = [3, 6, 12, 24, 36, 60]

    points = []
    months_to_target = None
    for m in months_grid:
        fv = _future_value(starting, monthly_contribution, m, annual_return_pct)
        pct = min(100.0, round(fv / target * 100, 2)) if target > 0 else 0
        points.append({"months": m, "value": fv, "percent_of_target": pct})
        if months_to_target is None and fv >= target:
            months_to_target = m

    # Finer estimate of months to target (linear search up to 360)
    if months_to_target is None:
        for m in range(1, 361):
            if _future_value(starting, monthly_contribution, m, annual_return_pct) >= target:
                months_to_target = m
                break

    return {
        "asset": a,
        "starting_balance": starting,
        "monthly_contribution": monthly_contribution,
        "annual_return_pct_illustrative": annual_return_pct,
        "target_value": target,
        "projection": points,
        "months_to_target": months_to_target,
        "disclaimer": "Projections are illustrative estimates based on a hypothetical return rate. Actual investment outcomes vary and are never guaranteed.",
    }


# ---------- FAVORITES & GOALS ----------
@router.post("/{asset_id}/favorite")
async def toggle_favorite(asset_id: str, user: dict = Depends(get_current_user)):
    a = await db.assets.find_one({"id": asset_id})
    if not a:
        raise HTTPException(404, "Asset not found")
    existing = await db.user_asset_prefs.find_one({"user_id": user["id"], "asset_id": asset_id})
    new_val = not bool((existing or {}).get("is_favorite"))
    await db.user_asset_prefs.update_one(
        {"user_id": user["id"], "asset_id": asset_id},
        {"$set": {"is_favorite": new_val, "updated_at": now_iso()}, "$setOnInsert": {"created_at": now_iso()}},
        upsert=True,
    )
    return {"asset_id": asset_id, "is_favorite": new_val}


@router.post("/{asset_id}/goal")
async def set_goal(asset_id: str, body: GoalBody, user: dict = Depends(get_current_user)):
    a = await db.assets.find_one({"id": asset_id})
    if not a:
        raise HTTPException(404, "Asset not found")
    await db.user_asset_prefs.update_one(
        {"user_id": user["id"], "asset_id": asset_id},
        {"$set": {
            "is_goal": True,
            "target_months": body.target_months,
            "monthly_contribution": body.monthly_contribution,
            "updated_at": now_iso(),
        }, "$setOnInsert": {"created_at": now_iso()}},
        upsert=True,
    )
    return {"asset_id": asset_id, "is_goal": True, "target_months": body.target_months, "monthly_contribution": body.monthly_contribution}


@router.delete("/{asset_id}/goal")
async def unset_goal(asset_id: str, user: dict = Depends(get_current_user)):
    await db.user_asset_prefs.update_one(
        {"user_id": user["id"], "asset_id": asset_id},
        {"$set": {"is_goal": False, "updated_at": now_iso()}},
    )
    return {"asset_id": asset_id, "is_goal": False}


@router.get("/me/favorites")
async def my_favorites(user: dict = Depends(get_current_user)):
    prefs = await db.user_asset_prefs.find({"user_id": user["id"], "is_favorite": True}, {"_id": 0}).to_list(500)
    ids = [p["asset_id"] for p in prefs]
    assets = await db.assets.find({"id": {"$in": ids}}, {"_id": 0}).to_list(500)
    for a in assets:
        a["is_favorite"] = True
    return assets


@router.get("/me/goals")
async def my_goals(user: dict = Depends(get_current_user)):
    prefs = await db.user_asset_prefs.find({"user_id": user["id"], "is_goal": True}, {"_id": 0}).to_list(500)
    ids = [p["asset_id"] for p in prefs]
    assets = await db.assets.find({"id": {"$in": ids}}, {"_id": 0}).to_list(500)
    pref_map = {p["asset_id"]: p for p in prefs}
    out = []
    for a in assets:
        p = pref_map[a["id"]]
        a["is_goal"] = True
        a["goal_target_months"] = p.get("target_months")
        a["goal_monthly_contribution"] = p.get("monthly_contribution")
        # Quick projection at the goal's settings
        starting = float(user.get("balance", 0))
        m = int(p.get("target_months", 24))
        contrib = float(p.get("monthly_contribution", 500))
        fv = _future_value(starting, contrib, m, 16.2)
        a["projected_at_goal_months"] = fv
        a["progress_percent"] = min(100.0, round(fv / a["market_value"] * 100, 1)) if a["market_value"] > 0 else 0
        out.append(a)
    return out
