import time
from collections import defaultdict


# { ip: [timestamp1, timestamp2, ...] }
_request_log: dict[str, list[float]] = defaultdict(list)

WINDOW_SECONDS = 3600  # 1 hour
MAX_REQUESTS = 5


def is_rate_limited(ip: str) -> bool:
    now = time.time()
    window_start = now - WINDOW_SECONDS

    # Drop timestamps outside the window
    _request_log[ip] = [t for t in _request_log[ip] if t > window_start]

    if len(_request_log[ip]) >= MAX_REQUESTS:
        return True

    _request_log[ip].append(now)
    return False


def remaining_requests(ip: str) -> int:
    now = time.time()
    window_start = now - WINDOW_SECONDS
    active = [t for t in _request_log[ip] if t > window_start]
    return max(0, MAX_REQUESTS - len(active))
