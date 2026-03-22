# Design Walkthrough — Vending Machine

> Only read after attempting the problem.

---

## The key structural decision

Each State holds no data — it only contains behavior. All data (balance, inventory, current state pointer) lives in `VendingMachine`. States are effectively stateless singletons that manipulate the machine.

```cpp
class VendingMachine {
    State* currentState;
    double balance = 0.0;
    std::unordered_map<std::string, Item> inventory;

    // Pre-allocated state objects
    IdleState idleState;
    HasCoinState hasCoinState;
    DispensingState dispensingState;
    OutOfStockState outOfStockState;

public:
    VendingMachine() { currentState = &idleState; }
    void setState(State* s) { currentState = s; }
    State* getIdleState() { return &idleState; }
    State* getHasCoinState() { return &hasCoinState; }
    // ...
};
```

This avoids `new`/`delete` for state transitions — just swap the pointer.

---

## State transition table

| State | insertCoin | selectItem | cancel |
|---|---|---|---|
| Idle | → HasCoin | "Insert coin first" | no-op |
| HasCoin | "Already inserted" | if valid item → Dispensing; else error | → Idle, refund |
| Dispensing | "Please wait" | "Please wait" | "Cannot cancel" |
| OutOfStock | "Machine empty" | "Machine empty" | no-op |

---

## Interview insight

The interviewer wants to see that you **didn't put conditionals in VendingMachine's methods**. The machine is just:

```cpp
void VendingMachine::insertCoin(double amount) {
    currentState->insertCoin(*this, amount);  // delegate entirely
}
```

Zero if-else. All branching is inside the State classes.
