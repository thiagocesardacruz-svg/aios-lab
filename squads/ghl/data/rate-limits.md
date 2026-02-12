# GoHighLevel Rate Limits

## API Limits

| Type | Limit | Scope |
|------|-------|-------|
| **Burst** | 100 requests / 10 seconds | Per resource |
| **Daily** | 200,000 requests / day | Per Marketplace app |

## Error Codes

| Code | Description | Action |
|------|-------------|--------|
| 429 | Too Many Requests | Exponential backoff |
| 401 | Unauthorized | Refresh token / check PIT |
| 403 | Forbidden | Check scopes |
| 500 | Server Error | Retry (max 3x) |

## Rate Limiting Strategy

### Token Bucket Implementation

```yaml
rate_limiting:
  strategy: token-bucket
  config:
    bucket_size: 100
    refill_rate: 10  # tokens per second
    delay_between_requests: 0.1s
```

### Exponential Backoff

```python
def exponential_backoff(attempt: int, base_delay: float = 1.0) -> float:
    """Calculate delay with jitter"""
    delay = base_delay * (2 ** attempt)
    jitter = random.uniform(0, delay * 0.1)
    return min(delay + jitter, 60)  # Max 60 seconds
```

### Implementation Pattern

```python
import time
from functools import wraps

def rate_limited(max_per_second: float = 10):
    """Decorator for rate limiting API calls"""
    min_interval = 1.0 / max_per_second
    last_called = [0.0]

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            elapsed = time.time() - last_called[0]
            wait_time = min_interval - elapsed
            if wait_time > 0:
                time.sleep(wait_time)
            result = func(*args, **kwargs)
            last_called[0] = time.time()
            return result
        return wrapper
    return decorator
```

## Queue Architecture

### Redis Queue (Recommended)

```yaml
queue:
  type: redis
  config:
    host: localhost
    port: 6379
    db: 0
    queue_name: ghl_api_queue
```

### In-Memory Queue (Simple)

```python
from queue import Queue
from threading import Thread

api_queue = Queue()

def queue_worker():
    while True:
        request = api_queue.get()
        try:
            execute_request(request)
        finally:
            api_queue.task_done()
        time.sleep(0.1)  # Rate limit

# Start worker
worker = Thread(target=queue_worker, daemon=True)
worker.start()
```

## Multi-Agent Considerations

### Problem
5 agents operating in parallel can saturate rate limits in milliseconds.

### Solution: Internal API Gateway

```
┌─────────────────────────────────────────────────────────────┐
│                    AIOS Agents                              │
│  (Snapshot, CRM, Funnel, Email, Automation)                 │
└─────────────────────────┬───────────────────────────────────┘
                          │ "Intent" requests
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                 Internal API Gateway                         │
│  - Token bucket rate limiting                                │
│  - Request queue (Redis/in-memory)                          │
│  - Exponential backoff on 429                               │
│  - Request deduplication                                     │
└─────────────────────────┬───────────────────────────────────┘
                          │ Controlled requests
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                 GoHighLevel API v2                          │
│                 (100 req/10s limit)                         │
└─────────────────────────────────────────────────────────────┘
```

## Monitoring

### Metrics to Track

| Metric | Purpose |
|--------|---------|
| requests_total | Total API calls |
| requests_success | Successful calls |
| requests_429 | Rate limit hits |
| requests_latency | Response time |
| queue_depth | Pending requests |

### Alert Thresholds

| Condition | Action |
|-----------|--------|
| 429 rate > 5% | Increase delays |
| Queue depth > 100 | Scale down agents |
| Daily usage > 180k | Warning alert |
| Daily usage > 195k | Critical - pause non-essential |

---

*Rate Limits Reference v1.0 - GHL Squad*
