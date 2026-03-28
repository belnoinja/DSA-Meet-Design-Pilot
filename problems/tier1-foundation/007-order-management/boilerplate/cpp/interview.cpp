#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
using namespace std;

// ─── Data Model (given — do not modify) ─────────────────────────────────────

enum class OrderState { Created, Confirmed, Shipped, Delivered };

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

// ─── Your Design Starts Here ────────────────────────────────────────────────
//
// Design and implement an OrderManager that:
//   1. Creates orders and stores them in a HashMap
//   2. Enforces valid state transitions:
//      Created -> Confirmed -> Shipped -> Delivered
//   3. Rejects any invalid transition (no skipping, no backward)
//
// Think about:
//   - How do you validate that a transition is legal?
//   - What data structure gives O(1) order lookup by ID?
//   - What happens when Extension 1 (cancellation) is added?
//
// Entry points (must exist for tests):
//   string create_order(vector<OrderItem> items, double totalAmount);
//   bool confirm_order(const string& orderId);
//   bool ship_order(const string& orderId);
//   bool deliver_order(const string& orderId);
//   OrderState get_order_state(const string& orderId);
//
// ─────────────────────────────────────────────────────────────────────────────


