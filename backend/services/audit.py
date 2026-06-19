"""Audit logging service - append-only log of security-relevant events."""
import uuid
from datetime import datetime, timezone
from core.db import db


async def log_event(event_type: str, user_id: str = None, ip: str = None, metadata: dict = None):
    doc = {
        "id": str(uuid.uuid4()),
        "event_type": event_type,
        "user_id": user_id,
        "ip": ip,
        "metadata": metadata or {},
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.audit_logs.insert_one(doc)
