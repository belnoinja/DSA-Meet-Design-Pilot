#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <queue>
using namespace std;

// ─── Data Model (given — do not modify) ─────────────────────────────────────

struct Request {
    string clientId;    // e.g. "user_123"
    long timestamp;     // epoch seconds
    string endpoint;    // e.g. "/api/payments"
};

enum class UserTier { FREE, PRO, ENTERPRISE };

// ─── Strategy Interface ─────────────────────────────────────────────────────
// HINT: This interface lets you swap rate-limiting algorithms at runtime.
// What methods would a rate limiter need?

class /* YourInterfaceName */ {
public:
    virtual bool /* allowOrReject */(const Request& req) = 0;
    virtual int  /* getCount */(const string& clientId) = 0;
    virtual ~/* YourInterfaceName */() = default;
};

// ─── Concrete Strategy ──────────────────────────────────────────────────────
// TODO: Implement a fixed-window rate limiter:
//   - Divide time into windows of windowSizeSeconds
//   - Track request count per client per window (use HashMap)
//   - If count >= maxRequests, reject
//   - When a new window starts, reset the count
//
// HINT: windowStart = (timestamp / windowSize) * windowSize


// ─── Global Entry Points ────────────────────────────────────────────────────
// TODO: Implement these functions using your rate limiter:
//
//   void init_limiter(int maxRequests, int windowSize);
//   bool allow_request(const Request& req);
//   int get_request_count(const string& clientId);
//
// How you implement them internally is up to you.
// ─────────────────────────────────────────────────────────────────────────────

