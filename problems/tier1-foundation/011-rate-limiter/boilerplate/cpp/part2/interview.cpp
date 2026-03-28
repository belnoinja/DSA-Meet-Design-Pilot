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

// ─── NEW in Extension 1 ────────────────────────────────────────────────────
//
// The platform team wants different endpoints to use different algorithms:
//   - fixed-window: simple counter per time window
//   - sliding-window: rolling window using a queue of timestamps
//   - token-bucket: tokens replenish at a fixed rate, allows bursts
//
// Think about:
//   - How do you create the right limiter without the caller knowing the algo?
//   - What pattern encapsulates object creation decisions?
//   - How would you add a 4th algorithm tomorrow?
//
// Entry points (must exist for tests):
//   void init_limiter(int maxRequests, int windowSize);
//   bool allow_request(const Request& req);
//   int get_request_count(const string& clientId);
//   RateLimiter* create_limiter(const string& algorithm, int maxRequests, int windowSize);
//   bool allow_request_with_strategy(const string& algorithm, const Request& req);
//
// ─────────────────────────────────────────────────────────────────────────────


