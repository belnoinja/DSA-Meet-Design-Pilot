# Design Walkthrough — Order Management System

> This file is the answer guide. Only read after you've attempted the problem.

---

## The Core Design Decision

The problem has **one moving part**: the order's state. Transitions between states must follow strict rules. A HashMap gives O(1) order lookup by ID.

The State pattern exists precisely for this: define valid transitions per state. Even without formal state objects, you need a clear transition table.

```
OrderManager (stable)
    └── Order
            └── OrderState: Created -> Confirmed -> Shipped -> Delivered
                                 \          \
                                  -> Cancelled (Part 2)
```

---

## Reference Implementation

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <chrono>
using namespace std;

// ─── Data Structures ────────────────────────────────────────────────────────

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

// ─── Observer Interface (Part 3) ────────────────────────────────────────────

class OrderObserver {
public:
    virtual void onStateChange(const string& orderId,
                               OrderState from, OrderState to) = 0;
    virtual ~OrderObserver() = default;
};

// ─── OrderManager ───────────────────────────────────────────────────────────

class OrderManager {
    unordered_map<string, Order> orders;
    unordered_map<string, int> inventory;
    unordered_map<string, vector<StateTransition>> history;
    vector<OrderObserver*> observers;
    int nextId = 1;

    long long now() {
        return chrono::duration_cast<chrono::milliseconds>(
            chrono::system_clock::now().time_since_epoch()).count();
    }

    bool transition(const string& orderId, OrderState expected, OrderState next) {
        auto it = orders.find(orderId);
        if (it == orders.end()) return false;
        if (it->second.state != expected) return false;

        OrderState from = it->second.state;
        it->second.state = next;

        // Record history (Part 3)
        history[orderId].push_back({from, next, now()});

        // Notify observers (Part 3)
        for (auto* obs : observers) {
            obs->onStateChange(orderId, from, next);
        }

        return true;
    }

public:
    void setInventory(const string& productId, int qty) {
        inventory[productId] = qty;
    }

    int getInventory(const string& productId) {
        auto it = inventory.find(productId);
        return it != inventory.end() ? it->second : 0;
    }

    string createOrder(vector<OrderItem> items, double totalAmount) {
        string id = "ORD-" + to_string(nextId++);

        // Decrement inventory (Part 2)
        for (auto& item : items) {
            inventory[item.productId] -= item.quantity;
        }

        orders[id] = {id, items, totalAmount, OrderState::Created};
        history[id].push_back({OrderState::Created, OrderState::Created, now()});
        return id;
    }

    bool confirmOrder(const string& orderId) {
        return transition(orderId, OrderState::Created, OrderState::Confirmed);
    }

    bool shipOrder(const string& orderId) {
        return transition(orderId, OrderState::Confirmed, OrderState::Shipped);
    }

    bool deliverOrder(const string& orderId) {
        return transition(orderId, OrderState::Shipped, OrderState::Delivered);
    }

    bool cancelOrder(const string& orderId) {
        auto it = orders.find(orderId);
        if (it == orders.end()) return false;

        OrderState current = it->second.state;
        if (current != OrderState::Created && current != OrderState::Confirmed)
            return false;

        // Release inventory
        for (auto& item : it->second.items) {
            inventory[item.productId] += item.quantity;
        }

        it->second.state = OrderState::Cancelled;
        history[orderId].push_back({current, OrderState::Cancelled, now()});

        for (auto* obs : observers) {
            obs->onStateChange(orderId, current, OrderState::Cancelled);
        }

        return true;
    }

    OrderState getOrderState(const string& orderId) {
        return orders.at(orderId).state;
    }

    vector<StateTransition> getOrderHistory(const string& orderId) {
        auto it = history.find(orderId);
        if (it == history.end()) return {};
        return it->second;
    }

    void addObserver(OrderObserver* obs) {
        observers.push_back(obs);
    }
};
```

---

## Extension 1: Cancellation + Inventory

The key insight is that cancellation is just another state transition — but it's valid from multiple source states (Created or Confirmed). On cancel, iterate through order items and restore inventory counts.

**Why use a HashMap for inventory?** O(1) lookup per product. When an order has N items, cancellation costs O(N) — one HashMap lookup per item.

---

## Extension 2: Transition History + Observer

The Observer pattern decouples "what happens on transition" from the state machine itself. The OrderManager notifies all observers without knowing what they do — could be logging, analytics, or alerts.

Each transition is recorded as a `{fromState, toState, timestamp}` triple, stored in a per-order vector.

---

## What interviewers look for

1. **Did you name the pattern?** Say "State pattern" for the lifecycle, "Observer pattern" for notifications.
2. **Did you enforce valid transitions?** No skipping states, no backward movement.
3. **Is inventory management atomic?** If cancel succeeds, all items are restored.
4. **Is the observer decoupled?** Adding a new observer requires zero changes to OrderManager.

---

## Common interview follow-ups

- *"What if you need to support partial cancellation?"* -> Track per-item state, not just per-order.
- *"What if two threads try to transition the same order?"* -> Need mutex or compare-and-swap on the state field.
- *"How would you persist this?"* -> Event sourcing: store transitions as the source of truth, reconstruct current state on load.
