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

// ─── Observer Interface ─────────────────────────────────────────────────────
// HINT: This is the Observer pattern. OrderManager is the subject.
// Observers register themselves and get notified on state changes.

class OrderObserver {
public:
    virtual void onStateChange(const string& orderId,
                               OrderState from, OrderState to) = 0;
    virtual ~OrderObserver() = default;
};

// ─── OrderManager ───────────────────────────────────────────────────────────
// HINT: You now need THREE HashMaps:
//   - orders: unordered_map<string, Order>
//   - inventory: unordered_map<string, int>
//   - history: unordered_map<string, vector<StateTransition>>
//
// Plus a vector<OrderObserver*> for registered observers.
//
// On every successful transition:
//   1. Record a StateTransition with timestamp
//   2. Notify all observers

// class OrderManager {
//     unordered_map<string, Order> orders;
//     unordered_map<string, int> inventory;
//     unordered_map<string, vector<StateTransition>> history;
//     vector<OrderObserver*> observers;
//     int nextId = 1;
// public:
//     // ... all Part 1 + Part 2 methods ...
//     vector<StateTransition> getOrderHistory(const string& orderId);
//     void addObserver(OrderObserver* obs);
// };

// ─── Test Entry Points (must exist for tests to compile) ────────────────────
//
//   All Part 1 + Part 2 entry points, plus:
//   vector<StateTransition> get_order_history(const string& orderId);
//   void add_observer(OrderObserver* obs);
//
// ─────────────────────────────────────────────────────────────────────────────

