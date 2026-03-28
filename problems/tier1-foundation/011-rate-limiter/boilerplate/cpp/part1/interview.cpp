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

// ─── Your Design Starts Here ────────────────────────────────────────────────
//
// Design and implement a Rate Limiter that:
//   1. Tracks requests per client in a fixed time window
//   2. Rejects requests that exceed the limit
//   3. Allows new rate-limiting algorithms to be added WITHOUT modifying
//      existing code
//
// Think about:
//   - What abstraction lets you swap rate-limiting logic at runtime?
//   - How would you track per-client request counts efficiently?
//   - What happens when the time window rolls over?
//
// Entry points (must exist for tests):
//   void init_limiter(int maxRequests, int windowSize);
//   bool allow_request(const Request& req);
//   int get_request_count(const string& clientId);
//
// ─────────────────────────────────────────────────────────────────────────────


