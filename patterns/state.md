# State Pattern

## The one-line explanation

Allow an object to alter its behavior when its internal state changes — the object will appear to change its class.

---

## When to use it

Use State when:
- An object's behavior depends heavily on its current state
- You have large `if-else` or `switch` blocks checking state throughout methods
- State transitions are complex and you want them explicit and testable

---

## The structure

```
Context (has a current State)
    └── State (interface)
            ├── ConcreteStateA  →  transitions to B or C
            ├── ConcreteStateB  →  transitions to A or C
            └── ConcreteStateC  →  transitions to A
```

The key insight: **each State object handles its own transitions**. The Context just delegates to whichever State is current.

---

## C++ Example

```cpp
#include <iostream>
#include <string>

class VendingMachine; // forward declaration

// State interface
class State {
public:
    virtual void insertCoin(VendingMachine& vm) = 0;
    virtual void selectItem(VendingMachine& vm) = 0;
    virtual void dispense(VendingMachine& vm) = 0;
    virtual std::string name() const = 0;
    virtual ~State() = default;
};

// Concrete states (simplified)
class IdleState : public State {
public:
    void insertCoin(VendingMachine& vm) override;  // → transitions to HasCoinState
    void selectItem(VendingMachine& vm) override { std::cout << "Insert coin first\n"; }
    void dispense(VendingMachine& vm) override { std::cout << "Insert coin first\n"; }
    std::string name() const override { return "Idle"; }
};

class HasCoinState : public State {
public:
    void insertCoin(VendingMachine& vm) override { std::cout << "Coin already inserted\n"; }
    void selectItem(VendingMachine& vm) override;  // → transitions to DispensingState
    void dispense(VendingMachine& vm) override { std::cout << "Select item first\n"; }
    std::string name() const override { return "HasCoin"; }
};
```

---

## vs. if-else approach

Without State pattern:
```cpp
void insertCoin() {
    if (currentState == IDLE) { currentState = HAS_COIN; }
    else if (currentState == HAS_COIN) { std::cout << "Already inserted\n"; }
    else if (currentState == OUT_OF_STOCK) { std::cout << "Machine empty\n"; }
    // grows with every new state...
}
```

With State pattern: each state class has its own `insertCoin()` — no cross-state conditionals.

---

## Real-world analogies

- **Traffic light**: Red → Green → Yellow → Red. Each light state knows what comes next
- **Order lifecycle**: Placed → Confirmed → Shipped → Delivered → Returned
- **Document workflow**: Draft → Review → Approved → Published

---

## The DSA connection

State machines are the theoretical foundation. Finite State Automata (FSA) from CS theory are exactly the State pattern — states + transitions + inputs.

---

## Common mistakes

1. **Too many states** — if you have 15 states, reconsider whether they can be grouped
2. **State knowing too much** — states should only know about transitions, not business logic unrelated to state
3. **Shared mutable state** — if multiple threads can change state simultaneously, you need locks

---

## Further reading

- [Refactoring Guru — State](https://refactoring.guru/design-patterns/state)
- [GFG — State Design Pattern](https://www.geeksforgeeks.org/state-design-pattern/)
