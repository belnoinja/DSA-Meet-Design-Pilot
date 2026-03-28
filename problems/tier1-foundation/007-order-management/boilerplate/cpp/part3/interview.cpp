#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <chrono>
using namespace std;

// ─── Data Model (given — do not modify) ─────────────────────────────────────

enum class OrderState { Created, Confirmed, Shipped, Delivered, Cancelled };

struct OrderItem {
    string productId;
    int quantity;
};

struct Order {
    string id;
    vector<OrderItem> items;
    double totalAmount;
    OrderState state;
};

struct StateTransition {
    OrderState fromState;
    OrderState toState;
    long long timestamp;
};

class OrderObserver {
public:
    virtual void onStateChange(const string& orderId,
                               OrderState from, OrderState to) = 0;
    virtual ~OrderObserver() = default;
};

// ─── NEW in Extension 2 ────────────────────────────────────────────────────
//
// Track the full transition history for every order.
// Notify registered observers on every successful state change.
//
// Think about:
//   - Where do you store per-order history? (HashMap of vectors)
//   - How do you decouple notification logic from the state machine?
//   - What if you want logging, analytics, AND alerts — all independently?
//
// Entry points (must exist for tests):
//   All Part 1 and Part 2 entry points, plus:
//   vector<StateTransition> get_order_history(const string& orderId);
//   void add_observer(OrderObserver* obs);
//
// ─────────────────────────────────────────────────────────────────────────────


