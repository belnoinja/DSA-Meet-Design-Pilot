# State Pattern

---

## 1. What is this pattern?

The State pattern lets an object **change its behavior when its internal state changes**. Instead of writing giant `if-else` or `switch` blocks that check the current state everywhere, you create separate classes for each state. Each state class knows what to do when an action is performed *in that state* and which state to transition to next. The object appears to "change its class" at runtime.

### Real-world analogy

Think about a vending machine. Its behavior depends entirely on what state it's in:

- **Idle state**: If you press "Dispense," nothing happens. If you insert a coin, it moves to "HasCoin" state.
- **HasCoin state**: If you insert another coin, it says "coin already inserted." If you select an item, it moves to "Dispensing" state.
- **Dispensing state**: It drops the item and goes back to "Idle."
- **OutOfStock state**: No matter what you do, it says "machine is empty."

Each state has its own rules. The machine doesn't have a giant `if (state == IDLE) ... else if (state == HAS_COIN) ...` block. Instead, each state is a separate "brain" that handles actions its own way.

Another example: An order on Amazon goes through states — Placed, Confirmed, Shipped, Delivered, Returned. What you can do depends on the state: you can cancel a "Placed" order but not a "Delivered" one. You can return a "Delivered" order but not a "Shipped" one. Each state has different allowed actions and transitions.

---

## 2. Why does it matter in interviews?

State is one of the **top 3 patterns** tested in LLD interviews. Here's why:

- **Vending Machine and Order Management are interview classics.** These two problems are asked at Amazon, Flipkart, Meesho, and PhonePe repeatedly. Both are textbook State pattern problems.
- **It tests if you can model complex behavior cleanly.** Any system with a lifecycle (orders, tickets, documents, payments) has states. Interviewers watch whether you model this as a messy if-else chain or as a clean state machine.
- **The follow-up trap.** Interviewers love saying: *"Now add a Maintenance state"* or *"Now add a Return state."* If you used if-else, you need to modify every method in your class. If you used State, you just add a new State class.
- **It separates strong candidates from average ones.** Most candidates from service companies write if-else state management. Product company interviewers specifically look for the State pattern to judge design maturity.

---

## 3. The problem it solves — what breaks without it

### The "before" code: if-else everywhere

```cpp
// BAD: Without State pattern
class VendingMachine {
    enum MachineState { IDLE, HAS_COIN, DISPENSING, OUT_OF_STOCK };
    MachineState currentState = IDLE;
    int itemCount = 10;

public:
    void insertCoin() {
        if (currentState == IDLE) {
            std::cout << "Coin inserted\n";
            currentState = HAS_COIN;
        }
        else if (currentState == HAS_COIN) {
            std::cout << "Coin already inserted\n";
        }
        else if (currentState == DISPENSING) {
            std::cout << "Wait, dispensing in progress\n";
        }
        else if (currentState == OUT_OF_STOCK) {
            std::cout << "Machine is out of stock\n";
        }
    }

    void selectItem() {
        if (currentState == IDLE) {
            std::cout << "Insert coin first\n";
        }
        else if (currentState == HAS_COIN) {
            std::cout << "Item selected\n";
            currentState = DISPENSING;
        }
        else if (currentState == DISPENSING) {
            std::cout << "Already dispensing\n";
        }
        else if (currentState == OUT_OF_STOCK) {
            std::cout << "Machine is out of stock\n";
        }
    }

    void dispense() {
        if (currentState == IDLE) {
            std::cout << "Insert coin first\n";
        }
        else if (currentState == HAS_COIN) {
            std::cout << "Select item first\n";
        }
        else if (currentState == DISPENSING) {
            itemCount--;
            std::cout << "Item dispensed\n";
            currentState = (itemCount > 0) ? IDLE : OUT_OF_STOCK;
        }
        else if (currentState == OUT_OF_STOCK) {
            std::cout << "Machine is out of stock\n";
        }
    }

    // PROBLEM: Every new state means adding another else-if
    // to EVERY method. Adding a "MAINTENANCE" state means
    // modifying insertCoin(), selectItem(), AND dispense().
    // With 6 states and 5 methods, that's 30 branches!
};
```

**What breaks:**
- Adding a new state (e.g., Maintenance) means modifying **every single method** — violates Open/Closed Principle
- With N states and M methods, you have N x M branches to maintain
- It's easy to forget a branch (what does `dispense()` do in MAINTENANCE state? You might forget to handle it)
- State transition logic is scattered across all methods — hard to trace the lifecycle
- Testing is painful — every method needs tests for every state

### The "after" code: State pattern

```cpp
// GOOD: With State pattern
// Each state is a separate class that handles ALL actions for that state.
// Adding a new state = adding a new class. Zero changes to existing code.

// See full implementation in Section 5 below.
```

**What improved:**
- Each state is a self-contained class — all behavior for that state is in one place
- Adding a new state = adding a new class, zero changes to existing states or the VendingMachine
- Transitions are explicit and visible — each state class shows exactly which states it can transition to
- Testing is clean — test each state class independently

---

## 4. UML / Structure

```
┌──────────────────────────────┐        ┌──────────────────────────────┐
│          Context              │        │      <<interface>>            │
│──────────────────────────────│ has-a  │          State                │
│ - currentState: State*        │───────>│──────────────────────────────│
│──────────────────────────────│        │ + insertCoin(Context&)       │
│ + setState(State*)            │        │ + selectItem(Context&)       │
│ + insertCoin()                │        │ + dispense(Context&)         │
│   → currentState->insertCoin()│        └──────────┬─────────────────┘
│ + selectItem()                │                   │ implements
│   → currentState->selectItem()│         ┌─────────┼──────────┐
│ + dispense()                  │         │         │          │
│   → currentState->dispense()  │   ┌─────┴──┐┌────┴────┐┌────┴──────┐
└──────────────────────────────┘   │ Idle    ││ HasCoin ││Dispensing │
                                    │ State   ││ State   ││ State     │
                                    │────────││─────────││───────────│
                                    │methods ││methods  ││methods    │
                                    └────────┘└─────────┘└───────────┘

Transition arrows:
  Idle ──insertCoin()──> HasCoin
  HasCoin ──selectItem()──> Dispensing
  Dispensing ──dispense()──> Idle (if items remain)
  Dispensing ──dispense()──> OutOfStock (if no items)
```

**Key relationships:**
- **Context** (VendingMachine) holds a pointer to the current State. It delegates all actions to it.
- **State** is an abstract interface. Each action that depends on state becomes a method here.
- **ConcreteState** classes implement the interface. Each state handles actions differently and manages its own transitions.
- **Transitions**: State classes call `context.setState(newState)` to change the machine's state. The Context itself never decides which state to go to — that's the State's job.

### State vs. Strategy — how to tell them apart

This is a **very common interview question**. They look structurally identical but differ in intent:

| | Strategy | State |
|---|---|---|
| **Who decides the switch?** | The **client** (external code) picks the algorithm | The **state itself** decides the next state (internal transitions) |
| **When does it switch?** | Explicitly, when the client calls `setStrategy()` | Automatically, as a result of an action |
| **States know about each other?** | No — strategies are independent | Yes — each state knows which states it can transition to |
| **Purpose** | Swap algorithms | Model a lifecycle with transitions |

---

## 5. C++ Implementation — Complete, compilable example

```cpp
#include <iostream>
#include <string>
#include <memory>

// ─────────────────────────────────────────────────────────
// Forward declaration — needed because State and Context
// reference each other (circular dependency)
// ─────────────────────────────────────────────────────────
class VendingMachine;

// ─────────────────────────────────────────────────────────
// STEP 1: Define the State interface
// Every possible action on the vending machine becomes
// a method here. Each concrete state implements all of them.
// ─────────────────────────────────────────────────────────
class State {
public:
    virtual void insertCoin(VendingMachine& vm) = 0;
    virtual void selectItem(VendingMachine& vm) = 0;
    virtual void dispense(VendingMachine& vm) = 0;
    virtual std::string name() const = 0;
    virtual ~State() = default;
};

// ─────────────────────────────────────────────────────────
// STEP 2: Define the Context
// The VendingMachine holds the current state and delegates
// all actions to it. It also exposes setState() so states
// can trigger transitions.
// ─────────────────────────────────────────────────────────
class VendingMachine {
    std::unique_ptr<State> currentState_;
    int itemCount_;

public:
    explicit VendingMachine(int itemCount);  // defined after states

    // Called by State classes to transition
    void setState(std::unique_ptr<State> newState) {
        std::cout << "  [Transition] " << currentState_->name()
                  << " -> " << newState->name() << std::endl;
        currentState_ = std::move(newState);
    }

    // Getters/setters for state classes to use
    int getItemCount() const { return itemCount_; }
    void decrementItemCount() { itemCount_--; }

    // Public API — just delegates to current state
    void insertCoin() {
        std::cout << "Action: insertCoin() in state [" << currentState_->name() << "]" << std::endl;
        currentState_->insertCoin(*this);
    }
    void selectItem() {
        std::cout << "Action: selectItem() in state [" << currentState_->name() << "]" << std::endl;
        currentState_->selectItem(*this);
    }
    void dispense() {
        std::cout << "Action: dispense() in state [" << currentState_->name() << "]" << std::endl;
        currentState_->dispense(*this);
    }
};

// ─────────────────────────────────────────────────────────
// STEP 3: Implement concrete states
// Each state handles every action and decides transitions.
// ─────────────────────────────────────────────────────────

// Forward declarations for transition targets
class IdleState;
class HasCoinState;
class DispensingState;
class OutOfStockState;

// --- IDLE STATE ---
// The machine is waiting for a coin.
class IdleState : public State {
public:
    void insertCoin(VendingMachine& vm) override {
        std::cout << "  Coin accepted." << std::endl;
        vm.setState(std::make_unique<HasCoinState>());
    }

    void selectItem(VendingMachine& vm) override {
        std::cout << "  Please insert a coin first." << std::endl;
    }

    void dispense(VendingMachine& vm) override {
        std::cout << "  Please insert a coin first." << std::endl;
    }

    std::string name() const override { return "Idle"; }
};

// --- HAS COIN STATE ---
// A coin has been inserted. Waiting for item selection.
class HasCoinState : public State {
public:
    void insertCoin(VendingMachine& vm) override {
        std::cout << "  Coin already inserted. Select an item." << std::endl;
    }

    void selectItem(VendingMachine& vm) override {
        std::cout << "  Item selected. Dispensing..." << std::endl;
        vm.setState(std::make_unique<DispensingState>());
    }

    void dispense(VendingMachine& vm) override {
        std::cout << "  Please select an item first." << std::endl;
    }

    std::string name() const override { return "HasCoin"; }
};

// --- DISPENSING STATE ---
// The machine is dispensing the item.
class DispensingState : public State {
public:
    void insertCoin(VendingMachine& vm) override {
        std::cout << "  Please wait, dispensing in progress." << std::endl;
    }

    void selectItem(VendingMachine& vm) override {
        std::cout << "  Please wait, dispensing in progress." << std::endl;
    }

    void dispense(VendingMachine& vm) override {
        vm.decrementItemCount();
        std::cout << "  Item dispensed! Remaining: " << vm.getItemCount() << std::endl;
        if (vm.getItemCount() > 0) {
            vm.setState(std::make_unique<IdleState>());
        } else {
            vm.setState(std::make_unique<OutOfStockState>());
        }
    }

    std::string name() const override { return "Dispensing"; }
};

// --- OUT OF STOCK STATE ---
// The machine has no items left.
class OutOfStockState : public State {
public:
    void insertCoin(VendingMachine& vm) override {
        std::cout << "  Machine is out of stock. Returning coin." << std::endl;
    }

    void selectItem(VendingMachine& vm) override {
        std::cout << "  Machine is out of stock." << std::endl;
    }

    void dispense(VendingMachine& vm) override {
        std::cout << "  Machine is out of stock." << std::endl;
    }

    std::string name() const override { return "OutOfStock"; }
};

// ─────────────────────────────────────────────────────────
// VendingMachine constructor (defined after states)
// ─────────────────────────────────────────────────────────
VendingMachine::VendingMachine(int itemCount) : itemCount_(itemCount) {
    if (itemCount > 0) {
        currentState_ = std::make_unique<IdleState>();
    } else {
        currentState_ = std::make_unique<OutOfStockState>();
    }
}

// ─────────────────────────────────────────────────────────
// STEP 4: Client code — simulates using the vending machine
// ─────────────────────────────────────────────────────────
int main() {
    // Machine with 2 items
    VendingMachine vm(2);

    std::cout << "=== Purchase 1 ===" << std::endl;
    vm.insertCoin();    // Idle -> HasCoin
    vm.selectItem();    // HasCoin -> Dispensing
    vm.dispense();      // Dispensing -> Idle (1 item left)

    std::cout << "\n=== Invalid actions ===" << std::endl;
    vm.selectItem();    // Idle state: "insert coin first"
    vm.dispense();      // Idle state: "insert coin first"

    std::cout << "\n=== Purchase 2 (last item) ===" << std::endl;
    vm.insertCoin();    // Idle -> HasCoin
    vm.selectItem();    // HasCoin -> Dispensing
    vm.dispense();      // Dispensing -> OutOfStock (0 items left)

    std::cout << "\n=== Try when out of stock ===" << std::endl;
    vm.insertCoin();    // OutOfStock: "returning coin"
    vm.selectItem();    // OutOfStock: "out of stock"

    return 0;
}
```

**Expected output:**
```
=== Purchase 1 ===
Action: insertCoin() in state [Idle]
  Coin accepted.
  [Transition] Idle -> HasCoin
Action: selectItem() in state [HasCoin]
  Item selected. Dispensing...
  [Transition] HasCoin -> Dispensing
Action: dispense() in state [Dispensing]
  Item dispensed! Remaining: 1
  [Transition] Dispensing -> Idle

=== Invalid actions ===
Action: selectItem() in state [Idle]
  Please insert a coin first.
Action: dispense() in state [Idle]
  Please insert a coin first.

=== Purchase 2 (last item) ===
Action: insertCoin() in state [Idle]
  Coin accepted.
  [Transition] Idle -> HasCoin
Action: selectItem() in state [HasCoin]
  Item selected. Dispensing...
  [Transition] HasCoin -> Dispensing
Action: dispense() in state [Dispensing]
  Item dispensed! Remaining: 0
  [Transition] Dispensing -> OutOfStock

=== Try when out of stock ===
Action: insertCoin() in state [OutOfStock]
  Machine is out of stock. Returning coin.
Action: selectItem() in state [OutOfStock]
  Machine is out of stock.
```

### The DSA connection

State machines are rooted in **Finite State Automata (FSA)** from CS theory — the same concept you learned in Theory of Computation. States + transitions + inputs = FSA. The State pattern is the object-oriented implementation of this concept.

In interview problems, whenever you see a lifecycle or workflow with defined transitions, think:
- **States** = the nodes in your FSA
- **Actions/Events** = the edges (transitions)
- **Invalid actions** = missing edges (the state rejects the action)

---

## 6. When to use it — Checklist

Use State when you see **any** of these signals:

- [ ] An object's behavior changes dramatically based on its current state
- [ ] You see (or are about to write) large `if-else` / `switch` blocks checking state in multiple methods
- [ ] The problem describes a lifecycle: Placed -> Confirmed -> Shipped -> Delivered
- [ ] Different actions are valid/invalid depending on the current state
- [ ] The interviewer says "add a new state" as a follow-up
- [ ] You're modeling something with a state diagram (vending machine, order, traffic light, document workflow)

**Do NOT use State when:**
- There are only 2 states with trivial logic — a boolean flag is fine
- State transitions are simple and don't affect behavior — just use an enum
- The "states" are really just configuration — use Strategy instead

---

## 7. Common mistakes in interviews

| Mistake | Why it's wrong | What to do instead |
|---|---|---|
| **Using enums + switch statements** | This is exactly what the State pattern replaces. You'll end up with N states x M methods = NM branches scattered everywhere. | Create a State class per state. Each class handles all M methods. |
| **Letting the Context manage transitions** | Writing `if (state == Idle && action == insertCoin) state = HasCoin` in the Context defeats the purpose. | Transitions belong in the State classes. Each state decides what comes next. |
| **States knowing too much business logic** | State classes should handle state-specific behavior and transitions, not unrelated business logic like calculating prices. | Keep States focused on "what happens when action X is performed in this state" and "which state comes next." |
| **Creating too many states** | If you have 15+ states, the pattern becomes unwieldy. | Group related states, or check if some "states" are really just properties (e.g., "LowBalance" vs "HighBalance" might just be a balance check). |
| **Forgetting to handle invalid actions** | Every state must handle every action, even if the answer is "not allowed in this state." | Implement all interface methods in every state. For invalid actions, print an error or throw an exception. |
| **Not drawing the state diagram first** | Jumping into code without mapping out states and transitions leads to missed transitions and bugs. | Always draw the state diagram on the whiteboard before writing code. Interviewers love this. |

---

## 8. Related patterns

| Pattern | Relationship |
|---|---|
| **Strategy** | Structurally identical (both use polymorphic delegation) but different intent. Strategy swaps algorithms chosen by the client. State changes behavior based on internal transitions triggered by actions. See the comparison table in Section 4. |
| **Observer** | State transitions often trigger notifications. When an order moves to "Shipped" state, Observer can notify the customer via email/SMS. State + Observer is a very common combination in interviews. |
| **Singleton** | State objects are often stateless (they only define behavior, not data). In that case, you can make each State a Singleton to avoid creating new State objects on every transition. This is an optimization, not a requirement. |
| **Command** | In complex systems, actions that trigger state transitions can be modeled as Command objects. This allows undo/redo of state changes. |

---

## 9. Practice problems in this repo

| Problem | Tier | Companies | How State is used |
|---|---|---|---|
| [004 - Vending Machine](../problems/tier1-foundation/004-vending-machine/) | Foundation | Amazon, Flipkart | Classic vending machine states: Idle, HasCoin, Dispensing, OutOfStock + Maintenance extension |
| [007 - Order Management System](../problems/tier1-foundation/007-order-management/) | Foundation | Meesho, PhonePe, Amazon | Order lifecycle: Placed, Confirmed, Shipped, Delivered, Cancelled, Returned |

---

## Further reading

- [Refactoring Guru — State](https://refactoring.guru/design-patterns/state)
- [GFG — State Design Pattern](https://www.geeksforgeeks.org/state-design-pattern/)
