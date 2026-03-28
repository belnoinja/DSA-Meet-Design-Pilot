#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <queue>
using namespace std;

// ─── Data Model (given — do not modify) ─────────────────────────────────────

struct Request {
    string clientId;
    long timestamp;
    string endpoint;
};

enum class UserTier { FREE, PRO, ENTERPRISE };

// ─── Strategy Interface ─────────────────────────────────────────────────────

class RateLimiter {
public:
    virtual bool allowRequest(const Request& req) = 0;
    virtual int getRequestCount(const string& clientId) = 0;
    virtual ~RateLimiter() = default;
};

// ─── Fixed-Window (provided from Part 1) ────────────────────────────────────

class FixedWindowLimiter : public RateLimiter {
    int maxRequests;
    int windowSizeSeconds;
    unordered_map<string, int> requestCounts;
    unordered_map<string, long> windowStarts;
    long getWindowStart(long ts) { return (ts / windowSizeSeconds) * windowSizeSeconds; }
public:
    FixedWindowLimiter(int maxReq, int ws) : maxRequests(maxReq), windowSizeSeconds(ws) {}
    bool allowRequest(const Request& req) override {
        long ws = getWindowStart(req.timestamp);
        if (windowStarts[req.clientId] != ws) { windowStarts[req.clientId] = ws; requestCounts[req.clientId] = 0; }
        if (requestCounts[req.clientId] >= maxRequests) return false;
        requestCounts[req.clientId]++;
        return true;
    }
    int getRequestCount(const string& cid) override { return requestCounts.count(cid) ? requestCounts[cid] : 0; }
};

// ─── Sliding-Window Limiter ─────────────────────────────────────────────────
// TODO: Implement using a queue of timestamps per client
// HINT: Pop expired timestamps from the front of the queue
//       If queue size >= maxRequests, reject

// class SlidingWindowLimiter : public RateLimiter { ... };


// ─── Token-Bucket Limiter ───────────────────────────────────────────────────
// TODO: Implement using a token count and last-refill timestamp per client
// HINT: tokens refill at rate = maxTokens / windowSize per second
//       On each request, refill based on elapsed time, then consume 1 token

// class TokenBucketLimiter : public RateLimiter { ... };


// ─── Factory ────────────────────────────────────────────────────────────────
// TODO: Create a factory that returns the right limiter based on algorithm name
//   "fixed-window"   -> FixedWindowLimiter
//   "sliding-window" -> SlidingWindowLimiter
//   "token-bucket"   -> TokenBucketLimiter
//   unknown          -> nullptr

// RateLimiter* create_limiter(const string& algorithm, int maxRequests, int windowSize);


// ─── Global Entry Points ────────────────────────────────────────────────────

static FixedWindowLimiter* g_limiter = nullptr;

void init_limiter(int maxRequests, int windowSize) {
    delete g_limiter;
    g_limiter = new FixedWindowLimiter(maxRequests, windowSize);
}

bool allow_request(const Request& req) {
    if (!g_limiter) return false;
    return g_limiter->allowRequest(req);
}

int get_request_count(const string& clientId) {
    if (!g_limiter) return 0;
    return g_limiter->getRequestCount(clientId);
}

// TODO: Implement allow_request_with_strategy()
// bool allow_request_with_strategy(const string& algorithm, const Request& req);

