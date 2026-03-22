# Problem 004 — Vending Machine

**Tier:** 1 (Foundation) | **Pattern:** State | **DSA:** HashMap
**Companies:** Amazon, Flipkart | **Time:** 45 minutes

---

## Problem Statement

Model a vending machine that goes through the following states:
- **Idle**: Waiting for coin insertion
- **HasCoin**: Coin inserted, waiting for item selection
- **Dispensing**: Item selected, dispensing in progress
- **OutOfStock**: No items available

The machine must handle invalid operations gracefully (e.g., selecting an item when no coin has been inserted) and transition correctly between states.

---

## Before You Code

> The key question: where do the transitions live?

**Naive approach:** One big class with `if (state == IDLE) { ... } else if (state == HAS_COIN) { ... }` in every method. What happens when you add a "maintenance mode" state? You touch every method.

**State pattern approach:** Each state is its own class. `IdleState::insertCoin()` transitions to `HasCoinState`. `HasCoinState::insertCoin()` says "coin already inserted." The machine just delegates to whatever state is current.

---

## Inventory

```cpp
struct Item {
    std::string name;
    double price;
    int quantity;
};
```

The machine holds inventory as `unordered_map<string, Item>` — O(1) lookup by item code.

---

## What to Implement

```cpp
class VendingMachine; // forward declare

class State {
public:
    virtual void insertCoin(VendingMachine& vm, double amount) = 0;
    virtual void selectItem(VendingMachine& vm, const std::string& code) = 0;
    virtual void cancel(VendingMachine& vm) = 0;
    virtual std::string stateName() const = 0;
    virtual ~State() = default;
};

// States to implement:
class IdleState      : public State { ... };
class HasCoinState   : public State { ... };
class DispensingState: public State { ... };
class OutOfStockState: public State { ... };

class VendingMachine {
public:
    VendingMachine();
    void addItem(const std::string& code, const Item& item);
    void insertCoin(double amount);
    void selectItem(const std::string& code);
    void cancel();
    std::string getCurrentState() const;
    double getCurrentBalance() const;

    // State transition helpers (called by State objects)
    void setState(State* newState);
    void addBalance(double amount);
    void resetBalance();
    Item* getItem(const std::string& code);
    void decrementItem(const std::string& code);
};
```

---

## Extensions

1. **Extension 1:** Add a `MaintenanceState` that the machine enters when `addItem()` is called. In maintenance, coin insertion is disabled. Maintenance exits when `exitMaintenance()` is called.

2. **Extension 2:** Add refund handling. If the user inserts $2 for an item costing $1.50, dispense the item AND return $0.50 change.

3. **Extension 3:** Track a transaction log — a `vector<Transaction>` where each entry records what happened (coin inserted, item dispensed, cancelled). Expose a `getHistory()` method.

---

## Running Tests

```bash
./run-tests.sh 004-vending-machine cpp
```
