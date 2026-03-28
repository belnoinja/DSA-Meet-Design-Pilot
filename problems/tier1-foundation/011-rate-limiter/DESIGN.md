# Design Walkthrough — API Rate Limiter

> This file is the answer guide. Only read after you've attempted the problem.

---

## The Core Design Decision

The problem has **two moving parts**: the rate-limiting algorithm and the creation logic for choosing which algorithm to use. The enforcement interface stays the same regardless of algorithm.

The Strategy pattern isolates the algorithm. The Factory pattern isolates the creation decision.

```
RateLimiterFactory (creation logic)
    └── RateLimiter (interface — stable)
            ├── FixedWindowLimiter   ← changes independently
            ├── SlidingWindowLimiter ← changes independently
            └── TokenBucketLimiter   ← changes independently
```

Adding a 4th algorithm doesn't touch the factory interface, the other limiters, or the calling code. **This is Open/Closed Principle in action.**

---

## Reference Implementation

### Part 1 — Fixed-Window Rate Limiter

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <queue>
#include <algorithm>
using namespace std;

struct Request {
    string clientId;
    long timestamp;
    string endpoint;
};

enum class UserTier { FREE, PRO, ENTERPRISE };

class RateLimiter {
public:
    virtual bool allowRequest(const Request& req) = 0;
    virtual int getRequestCount(const string& clientId) = 0;
    virtual ~RateLimiter() = default;
};

class FixedWindowLimiter : public RateLimiter {
    int maxRequests;
    int windowSizeSeconds;
    unordered_map<string, int> requestCounts;
    unordered_map<string, long> windowStarts;

    long getWindowStart(long timestamp) {
        return (timestamp / windowSizeSeconds) * windowSizeSeconds;
    }

public:
    FixedWindowLimiter(int maxReq, int windowSize)
        : maxRequests(maxReq), windowSizeSeconds(windowSize) {}

    bool allowRequest(const Request& req) override {
        long windowStart = getWindowStart(req.timestamp);
        // Reset if new window
        if (windowStarts[req.clientId] != windowStart) {
            windowStarts[req.clientId] = windowStart;
            requestCounts[req.clientId] = 0;
        }
        if (requestCounts[req.clientId] >= maxRequests) {
            return false;
        }
        requestCounts[req.clientId]++;
        return true;
    }

    int getRequestCount(const string& clientId) override {
        return requestCounts.count(clientId) ? requestCounts[clientId] : 0;
    }
};
```

### Part 2 — Multiple Algorithms via Strategy + Factory

```cpp
class SlidingWindowLimiter : public RateLimiter {
    int maxRequests;
    int windowSizeSeconds;
    unordered_map<string, queue<long>> requestQueues;

public:
    SlidingWindowLimiter(int maxReq, int windowSize)
        : maxRequests(maxReq), windowSizeSeconds(windowSize) {}

    bool allowRequest(const Request& req) override {
        auto& q = requestQueues[req.clientId];
        // Remove expired timestamps
        while (!q.empty() && q.front() <= req.timestamp - windowSizeSeconds) {
            q.pop();
        }
        if ((int)q.size() >= maxRequests) {
            return false;
        }
        q.push(req.timestamp);
        return true;
    }

    int getRequestCount(const string& clientId) override {
        return requestQueues.count(clientId) ? (int)requestQueues[clientId].size() : 0;
    }
};

class TokenBucketLimiter : public RateLimiter {
    int maxTokens;
    double refillRatePerSecond;
    unordered_map<string, double> tokens;
    unordered_map<string, long> lastRefillTime;

public:
    TokenBucketLimiter(int maxTok, int windowSize)
        : maxTokens(maxTok), refillRatePerSecond((double)maxTok / windowSize) {}

    bool allowRequest(const Request& req) override {
        if (tokens.find(req.clientId) == tokens.end()) {
            tokens[req.clientId] = maxTokens;
            lastRefillTime[req.clientId] = req.timestamp;
        }
        // Refill tokens
        long elapsed = req.timestamp - lastRefillTime[req.clientId];
        tokens[req.clientId] = min((double)maxTokens,
            tokens[req.clientId] + elapsed * refillRatePerSecond);
        lastRefillTime[req.clientId] = req.timestamp;

        if (tokens[req.clientId] < 1.0) {
            return false;
        }
        tokens[req.clientId] -= 1.0;
        return true;
    }

    int getRequestCount(const string& clientId) override {
        // For token bucket, return tokens consumed (max - remaining)
        if (tokens.find(clientId) == tokens.end()) return 0;
        return maxTokens - (int)tokens[clientId];
    }
};

class RateLimiterFactory {
public:
    static RateLimiter* create(const string& algorithm, int maxRequests, int windowSize) {
        if (algorithm == "fixed-window") return new FixedWindowLimiter(maxRequests, windowSize);
        if (algorithm == "sliding-window") return new SlidingWindowLimiter(maxRequests, windowSize);
        if (algorithm == "token-bucket") return new TokenBucketLimiter(maxRequests, windowSize);
        return nullptr;
    }
};
```

### Part 3 — User Tier-Based Rate Limits

```cpp
class TierBasedFactory {
public:
    static int getLimitForTier(UserTier tier) {
        switch (tier) {
            case UserTier::FREE:       return 10;
            case UserTier::PRO:        return 100;
            case UserTier::ENTERPRISE: return 1000;
        }
        return 10;
    }

    static RateLimiter* create(UserTier tier, const string& algorithm = "fixed-window") {
        int limit = getLimitForTier(tier);
        return RateLimiterFactory::create(algorithm, limit, 60);
    }
};
```

---

## What interviewers look for

1. **Did you name the patterns?** Say "Strategy pattern for algorithms, Factory pattern for creation" out loud.
2. **Did you separate interface from implementation?** `RateLimiter` is the contract; concrete classes fulfill it.
3. **Is your system closed for modification?** Adding a new algorithm shouldn't touch existing limiters.
4. **Do you understand the DSA tradeoffs?** HashMap for O(1) client lookup, Queue for sliding-window timestamp tracking.
5. **Can you articulate algorithm tradeoffs?** Fixed-window has boundary burst issues, sliding-window is smoother but uses more memory, token-bucket allows controlled bursts.

---

## Common interview follow-ups

- *"What happens at window boundaries with fixed-window?"* — A client could make N requests at the end of window 1 and N at the start of window 2, effectively getting 2N in a short span. Sliding-window solves this.
- *"How would you make this distributed?"* — Use Redis for shared state, or use a distributed token bucket with eventual consistency.
- *"What if you need per-endpoint AND per-user limits?"* — Compose the client key: `clientId + endpoint` or chain multiple limiters.
- *"How would you test this?"* — Inject timestamps rather than using wall-clock time. Test boundary conditions at window edges.
