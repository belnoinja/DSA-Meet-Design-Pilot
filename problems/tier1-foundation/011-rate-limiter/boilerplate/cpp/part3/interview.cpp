#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <queue>
#include <algorithm>
using namespace std;

// ─── Data Model (given — do not modify) ─────────────────────────────────────

struct Request {
    string clientId;
    long timestamp;
    string endpoint;
};

enum class UserTier { FREE, PRO, ENTERPRISE };

// ─── NEW in Extension 2 ────────────────────────────────────────────────────
//
// Different user tiers have different rate limits:
//   FREE       = 10 requests per minute
//   PRO        = 100 requests per minute
//   ENTERPRISE = 1000 requests per minute
//
// Think about:
//   - How does the Factory pattern adapt to handle tier-based creation?
//   - Can you combine tier limits with per-endpoint algorithm selection?
//   - What changes if a new tier is added (e.g., STARTUP = 50 req/min)?
//
// Entry points (must exist for tests — all previous entry points plus):
//   bool allow_request_for_tier(UserTier tier, const Request& req);
//
// ─────────────────────────────────────────────────────────────────────────────


