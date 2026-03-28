#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <queue>
#include <algorithm>
using namespace std;

// ─── Data Structures ────────────────────────────────────────────────────────

struct Request {
    string clientId;    // e.g. "user_123"
    long timestamp;     // epoch seconds
    string endpoint;    // e.g. "/api/payments"
};

enum class UserTier { FREE, PRO, ENTERPRISE };

// ─── Strategy Interface ─────────────────────────────────────────────────────

class RateLimiter {
public:
    virtual bool allowRequest(const Request& req) = 0;
    virtual int getRequestCount(const string& clientId) = 0;
    virtual ~RateLimiter() = default;
};

// ─── TODO: Implement Fixed-Window Rate Limiter ──────────────────────────────

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
        // TODO: Check if client is in current window, reset if new window
        // TODO: If count >= maxRequests, reject
        // TODO: Increment count and allow
        return false;
    }

    int getRequestCount(const string& clientId) override {
        // TODO: Return current request count for client
        return 0;
    }
};

// ─── Global Limiter Instance (for Part 1 entry points) ─────────────────────

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

// ─── Main (test your implementation) ────────────────────────────────────────

int main() {
    init_limiter(5, 60); // 5 requests per 60-second window

    vector<Request> requests = {
        {"user_1", 1000, "/api/search"},
        {"user_1", 1001, "/api/search"},
        {"user_1", 1002, "/api/search"},
        {"user_1", 1003, "/api/search"},
        {"user_1", 1004, "/api/search"},
        {"user_1", 1005, "/api/search"}, // should be rejected
    };

    for (const auto& req : requests) {
        bool allowed = allow_request(req);
        cout << "Request from " << req.clientId << " at " << req.timestamp
             << ": " << (allowed ? "ALLOWED" : "REJECTED") << endl;
    }

    cout << "Request count for user_1: " << get_request_count("user_1") << endl;

    delete g_limiter;
    return 0;
}
