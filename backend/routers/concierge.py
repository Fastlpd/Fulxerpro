"""AI Investor Concierge — Claude Sonnet 4.5 streaming chat with full FulxerPro context + memory."""
import os
import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from datetime import datetime, timezone
from core.db import db
from core.deps import get_current_user
from models.schemas import new_id, now_iso
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

router = APIRouter(prefix="/concierge", tags=["concierge"])


class AskBody(BaseModel):
    message: str
    session_id: str | None = None


async def _build_context(user: dict) -> str:
    """Build a rich system prompt with the user's portfolio state + active plans."""
    plans = await db.plans.find({"active": True}, {"_id": 0}).to_list(50)
    invs = await db.investments.find({"user_id": user["id"]}, {"_id": 0}).to_list(200)
    active_invs = [i for i in invs if i["status"] == "active"]
    tx_count = await db.transactions.count_documents({"user_id": user["id"]})
    total_invested = sum(i["amount"] for i in active_invs)

    plans_summary = "\n".join(
        f"- {p['name']} ({p['risk_level']} risk): {p['roi_percent']}% ROI over {p['duration_days']} days, "
        f"min ${p['min_amount']:,.0f} – max ${p['max_amount']:,.0f}"
        for p in plans
    )
    holdings_summary = "\n".join(
        f"- {i['plan_name']}: ${i['amount']:,.2f} invested, expected ${i['expected_return']:,.2f} at maturity ({i['matures_at'][:10]})"
        for i in active_invs
    ) or "  (no active positions)"

    return f"""You are FulxerPro Concierge — an institutional-grade AI investment advisor for the FulxerPro platform.

INVESTOR PROFILE
- Name: {user.get('name')}
- Email: {user.get('email')}
- KYC status: {user.get('kyc_status')}
- Available balance: ${user.get('balance', 0):,.2f}
- Active investments: {len(active_invs)} (total invested ${total_invested:,.2f})
- Total transactions: {tx_count}

ACTIVE PLANS AVAILABLE
{plans_summary}

INVESTOR'S CURRENT HOLDINGS
{holdings_summary}

YOUR ROLE
- Answer questions about plans, ROI, risk, KYC, deposits, withdrawals, and the platform.
- Recommend plans based on the investor's stated goals, balance, and risk tolerance.
- Never invent plans, balances, or returns. Use only the data above.
- Encourage KYC completion if status != "verified" before investment recommendations.
- For complex compliance/tax/regulatory questions, recommend the investor contact a human advisor.
- Be concise, confident, and warm — like a senior private banker. No emojis. Keep responses under 200 words unless asked for detail.
"""


@router.post("/ask")
async def ask(body: AskBody, user: dict = Depends(get_current_user)):
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise HTTPException(500, "LLM key not configured")

    session_id = body.session_id or f"user_{user['id']}"
    system_message = await _build_context(user)

    chat = LlmChat(api_key=api_key, session_id=session_id, system_message=system_message).with_model(
        "anthropic", "claude-sonnet-4-5-20250929"
    )

    # Persist the user message
    await db.concierge_messages.insert_one({
        "id": new_id(),
        "user_id": user["id"],
        "session_id": session_id,
        "role": "user",
        "content": body.message,
        "created_at": now_iso(),
    })

    async def event_stream():
        full_response = ""
        try:
            async for ev in chat.stream_message(UserMessage(text=body.message)):
                if isinstance(ev, TextDelta):
                    full_response += ev.content
                    yield f"data: {json.dumps({'type': 'delta', 'content': ev.content})}\n\n"
                elif isinstance(ev, StreamDone):
                    break
            # Save full assistant response
            await db.concierge_messages.insert_one({
                "id": new_id(),
                "user_id": user["id"],
                "session_id": session_id,
                "role": "assistant",
                "content": full_response,
                "created_at": now_iso(),
            })
            yield f"data: {json.dumps({'type': 'done', 'session_id': session_id})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'error': str(e)})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no", "Connection": "keep-alive"},
    )


@router.get("/history")
async def history(session_id: str | None = None, user: dict = Depends(get_current_user)):
    q = {"user_id": user["id"]}
    if session_id:
        q["session_id"] = session_id
    msgs = await db.concierge_messages.find(q, {"_id": 0}).sort("created_at", 1).to_list(500)
    return {"session_id": session_id or f"user_{user['id']}", "messages": msgs}
