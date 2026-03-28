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

// ─── OrderManager ───────────────────────────────────────────────────────────
// HINT: Use a HashMap (unordered_map) to store orders by ID.
// Each transition method should check the current state before changing it.

// class OrderManager {
//     unordered_map<string, Order> orders;
//     int nextId = 1;
// public:
//     string createOrder(vector<OrderItem> items, double totalAmount);
//     bool confirmOrder(const string& orderId);  // Created -> Confirmed
//     bool shipOrder(const string& orderId);      // Confirmed -> Shipped
//     bool deliverOrder(const string& orderId);   // Shipped -> Delivered
//     OrderState getOrderState(const string& orderId);
// };

// HINT: Consider a private helper method like:
//   bool transition(const string& orderId, OrderState expected, OrderState next);
// This avoids duplicating the "check current state, then update" logic.

// ─── Test Entry Points (must exist for tests to compile) ────────────────────
// Your solution must provide these functions:
//
//   string create_order(vector<OrderItem> items, double totalAmount);
//   bool confirm_order(const string& orderId);
//   bool ship_order(const string& orderId);
//   bool deliver_order(const string& orderId);
//   OrderState get_order_state(const string& orderId);
//
// How you implement them internally is up to you.
// ─────────────────────────────────────────────────────────────────────────────

