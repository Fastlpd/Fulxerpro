"""In-memory rate limiter (simple sliding-window). For production, replace with Redis."""
import time
from collections import defaultdict, deque
from fastapi import Request, HTTPException

_BUCKETS: dict = defaultdict(deque)


def rate_limit(key: str, max_calls: int, window_seconds: int):
    now = time.time()
    bucket = _BUCKETS[key]
    while bucket and bucket[0] < now - window_seconds:
        bucket.popleft()
    if len(bucket) >= max_calls:
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
    bucket.append(now)


def make_limiter(max_calls: int, window_seconds: int, scope: str = "global"):
    async def _dep(request: Request):
        ip = request.client.host if request.client else "unknown"
        rate_limit(f"{scope}:{ip}", max_calls, window_seconds)
    return _dep
