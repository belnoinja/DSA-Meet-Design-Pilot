# Strategy Pattern

---

## 1. What is this pattern?

The Strategy pattern lets you define a **family of algorithms**, put each one in its own class, and make them **interchangeable**. The object that uses the algorithm (called the **Context**) doesn't care which specific algorithm it's running — it just calls the same interface. You can swap algorithms at runtime without touching the Context's code.

### Real-world analogy

Think about how you pay for an order on Flipkart. You can pay via **Credit Card**, **UPI**, **Net Banking**, or **Cash on Delivery**. From Flipkart's perspective, all it needs is: `pay(amount)` and `refund(amount)`. The actual *how* of payment is different for each method, but the checkout flow doesn't change. Each payment method is a **strategy**.

Another example: Google Maps lets you choose **Fastest route**, **Shortest route**, or **Avoid tolls**. Same input (source and destination), same output (a route), but the algorithm behind each option is completely different. That's Strategy.

---

## 2. Why does it matter in interviews?

Strategy is **the most frequently tested design pattern** in LLD interviews at product companies. Here's why:

- **It's the gateway pattern.** Interviewers use it to check if you understand polymorphism, interfaces, and the Open/Closed Principle. If you can't apply Strategy, they'll assume you can't handle harder patterns either.
- **It shows up in almost every LLD problem.** Payment systems, pricing engines, sorting/ranking, rate limiters, search filters, discount engines — all of these have a "pick one algorithm from many" requirement. That's Strategy.
- **It's the "extend without modifying" test.** Interviewers love follow-up questions like: *"Now add a new sorting criterion"* or *"Now support a different pricing algorithm."* If your design uses if-else, you fail. If you used Strategy, you just add a new class.

At companies like Amazon, Flipkart, Razorpay, and Uber, the interviewer will watch whether you reach for Strategy instinctively when you see multiple interchangeable behaviors. It's table stakes for clearing an LLD round.

---

## 3. The problem it solves — what breaks without it

### The "before" code: if-else nightmare

Imagine you're building a payment ranker that sorts payment methods by different criteria — rewards, fees, or speed.

```cpp
// BAD: Without Strategy pattern
class PaymentRanker {
public:
    void rank(std::vector<PaymentMethod>& methods, const std::string& criteria) {
        if (criteria == "rewards") {
            std::sort(methods.begin(), methods.end(),
                [](const PaymentMethod& a, const PaymentMethod& b) {
                    return a.rewardRate > b.rewardRate;
                });
        }
        else if (criteria == "fees") {
            std::sort(methods.begin(), methods.end(),
                [](const PaymentMethod& a, const PaymentMethod& b) {
                    return a.fee < b.fee;
                });
        }
        else if (criteria == "speed") {
            std::sort(methods.begin(), methods.end(),
                [](const PaymentMethod& a, const PaymentMethod& b) {
                    return a.processingTime < b.processingTime;
                });
        }
        // Every new criteria = another else-if here
        // This function grows forever and violates Open/Closed Principle
    }
};
```

**What breaks:**
- Adding a new ranking criteria (say "cashback") means **modifying** this class — violates Open/Closed Principle
- If you have 10 criteria, this method becomes 100+ lines of branching logic
- Testing is painful — you can't test one criteria in isolation
- Two developers adding different criteria will create **merge conflicts** on the same file

### The "after" code: Strategy pattern

```cpp
// GOOD: With Strategy pattern
class RankingStrategy {
public:
    virtual void rank(std::vector<PaymentMethod>& methods) = 0;
    virtual ~RankingStrategy() = default;
};

class RankByRewards : public RankingStrategy {
public:
    void rank(std::vector<PaymentMethod>& methods) override {
        std::sort(methods.begin(), methods.end(),
            [](const PaymentMethod& a, const PaymentMethod& b) {
                return a.rewardRate > b.rewardRate;
            });
    }
};

class RankByFees : public RankingStrategy {
public:
    void rank(std::vector<PaymentMethod>& methods) override {
        std::sort(methods.begin(), methods.end(),
            [](const PaymentMethod& a, const PaymentMethod& b) {
                return a.fee < b.fee;
            });
    }
};

// Adding a new criteria = adding a new class. Zero changes to existing code.
class RankByCashback : public RankingStrategy {
public:
    void rank(std::vector<PaymentMethod>& methods) override {
        std::sort(methods.begin(), methods.end(),
            [](const PaymentMethod& a, const PaymentMethod& b) {
                return a.cashbackRate > b.cashbackRate;
            });
    }
};

class PaymentRanker {
    RankingStrategy* strategy;
public:
    PaymentRanker(RankingStrategy* s) : strategy(s) {}
    void setStrategy(RankingStrategy* s) { strategy = s; }
    void rank(std::vector<PaymentMethod>& methods) { strategy->rank(methods); }
};
```

**What improved:**
- New criteria = new class, zero changes to PaymentRanker (Open/Closed Principle)
- Each strategy can be tested independently
- No merge conflicts — developers work on separate files
- Strategies can be swapped at runtime

---

## 4. UML / Structure

```
┌─────────────────────────┐         ┌──────────────────────────────┐
│        Context           │         │    <<interface>>              │
│─────────────────────────│ uses    │       Strategy                │
│ - strategy: Strategy*    │────────>│──────────────────────────────│
│─────────────────────────│         │ + execute(data): void         │
│ + setStrategy(s)         │         └──────────────┬───────────────┘
│ + doWork()               │                        │ implements
│   → strategy->execute()  │              ┌─────────┼─────────┐
└─────────────────────────┘              │         │         │
                                  ┌──────┴───┐┌───┴────┐┌───┴────────┐
                                  │StrategyA ││StrategyB││ StrategyC  │
                                  │──────────││────────││────────────│
                                  │+execute()││+execute()││+execute()  │
                                  └──────────┘└────────┘└────────────┘
```

**Key relationships:**
- **Context** holds a pointer/reference to a Strategy. It delegates work to it.
- **Strategy** is an abstract interface (pure virtual class in C++).
- **ConcreteStrategy** classes implement the interface with different algorithms.
- The **client** (caller) creates a ConcreteStrategy and injects it into the Context.

---

## 5. C++ Implementation — Complete, compilable example

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <memory>
#include <string>

// ─────────────────────────────────────────────────────────
// DOMAIN: A simple PaymentMethod struct
// ─────────────────────────────────────────────────────────
struct PaymentMethod {
    std::string name;
    double rewardRate;   // percentage, higher is better
    double fee;          // flat fee, lower is better
    int speedMinutes;    // processing time, lower is better

    // Helper for printing
    friend std::ostream& operator<<(std::ostream& os, const PaymentMethod& pm) {
        os << pm.name << " (rewards=" << pm.rewardRate
           << "%, fee=" << pm.fee << ", speed=" << pm.speedMinutes << "min)";
        return os;
    }
};

// ─────────────────────────────────────────────────────────
// STEP 1: Define the Strategy interface
// This is a pure abstract class. All concrete strategies
// must implement the rank() method.
// ─────────────────────────────────────────────────────────
class RankingStrategy {
public:
    virtual void rank(std::vector<PaymentMethod>& methods) = 0;
    virtual ~RankingStrategy() = default;
};

// ─────────────────────────────────────────────────────────
// STEP 2: Create concrete strategies
// Each class encapsulates ONE ranking algorithm.
// ─────────────────────────────────────────────────────────

// Ranks by highest reward rate first
class RankByRewards : public RankingStrategy {
public:
    void rank(std::vector<PaymentMethod>& methods) override {
        std::sort(methods.begin(), methods.end(),
            [](const PaymentMethod& a, const PaymentMethod& b) {
                return a.rewardRate > b.rewardRate;
            });
    }
};

// Ranks by lowest fee first
class RankByFees : public RankingStrategy {
public:
    void rank(std::vector<PaymentMethod>& methods) override {
        std::sort(methods.begin(), methods.end(),
            [](const PaymentMethod& a, const PaymentMethod& b) {
                return a.fee < b.fee;
            });
    }
};

// Ranks by fastest processing time first
class RankBySpeed : public RankingStrategy {
public:
    void rank(std::vector<PaymentMethod>& methods) override {
        std::sort(methods.begin(), methods.end(),
            [](const PaymentMethod& a, const PaymentMethod& b) {
                return a.speedMinutes < b.speedMinutes;
            });
    }
};

// ─────────────────────────────────────────────────────────
// STEP 3: Create the Context
// The Context doesn't know which strategy it's using.
// It just calls strategy->rank(). This is the key insight.
// ─────────────────────────────────────────────────────────
class PaymentRanker {
    std::unique_ptr<RankingStrategy> strategy_;

public:
    // Constructor takes ownership of the strategy
    explicit PaymentRanker(std::unique_ptr<RankingStrategy> strategy)
        : strategy_(std::move(strategy)) {}

    // Swap strategy at runtime — no code change needed
    void setStrategy(std::unique_ptr<RankingStrategy> strategy) {
        strategy_ = std::move(strategy);
    }

    // Delegates ranking to whichever strategy is currently set
    void rank(std::vector<PaymentMethod>& methods) {
        strategy_->rank(methods);
    }
};

// ─────────────────────────────────────────────────────────
// STEP 4: Client code — creates strategies and uses them
// ─────────────────────────────────────────────────────────
int main() {
    // Sample payment methods
    std::vector<PaymentMethod> methods = {
        {"Credit Card",  5.0, 20.0, 2},
        {"UPI",          1.0,  0.0, 1},
        {"Net Banking",  2.0, 10.0, 5},
        {"Wallet",       3.0,  5.0, 1},
    };

    // Create ranker with "rank by rewards" strategy
    PaymentRanker ranker(std::make_unique<RankByRewards>());

    std::cout << "=== Ranked by Rewards ===" << std::endl;
    ranker.rank(methods);
    for (const auto& m : methods) std::cout << "  " << m << std::endl;

    // Swap to "rank by fees" at runtime — no code change in PaymentRanker
    ranker.setStrategy(std::make_unique<RankByFees>());

    std::cout << "\n=== Ranked by Fees ===" << std::endl;
    ranker.rank(methods);
    for (const auto& m : methods) std::cout << "  " << m << std::endl;

    // Swap to "rank by speed" at runtime
    ranker.setStrategy(std::make_unique<RankBySpeed>());

    std::cout << "\n=== Ranked by Speed ===" << std::endl;
    ranker.rank(methods);
    for (const auto& m : methods) std::cout << "  " << m << std::endl;

    return 0;
}
```

**Expected output:**
```
=== Ranked by Rewards ===
  Credit Card (rewards=5%, fee=20, speed=2min)
  Wallet (rewards=3%, fee=5, speed=1min)
  Net Banking (rewards=2%, fee=10, speed=5min)
  UPI (rewards=1%, fee=0, speed=1min)

=== Ranked by Fees ===
  UPI (rewards=1%, fee=0, speed=1min)
  Wallet (rewards=3%, fee=5, speed=1min)
  Net Banking (rewards=2%, fee=10, speed=5min)
  Credit Card (rewards=5%, fee=20, speed=2min)

=== Ranked by Speed ===
  UPI (rewards=1%, fee=0, speed=1min)
  Wallet (rewards=3%, fee=5, speed=1min)
  Credit Card (rewards=5%, fee=20, speed=2min)
  Net Banking (rewards=2%, fee=10, speed=5min)
```

### The DSA connection

Strategy is naturally paired with **sorting comparators**. When you define a custom comparator and pass it to `std::sort`, you're essentially using the Strategy pattern — the sort algorithm is fixed, but the comparison logic is swappable.

```cpp
// This lambda IS a strategy — just a lightweight one
auto byRewards = [](const PaymentMethod& a, const PaymentMethod& b) {
    return a.rewardRate > b.rewardRate;
};
std::sort(methods.begin(), methods.end(), byRewards);
```

In interviews, the jump from "use a comparator" to "use the Strategy pattern" is exactly what separates a DSA-only answer from an LLD-quality answer.

---

## 6. When to use it — Checklist

Use Strategy when you see **any** of these signals:

- [ ] Multiple variants of an algorithm exist (sort by X, sort by Y, sort by Z)
- [ ] The interviewer says "now support a new type of ___" as a follow-up
- [ ] You see `if (type == "A") ... else if (type == "B") ...` branching on algorithm selection
- [ ] You need to switch algorithms at runtime (user picks a sorting mode, admin picks a pricing model)
- [ ] Different users/tiers need different behavior for the same operation
- [ ] You want to add new algorithms without modifying existing code

**Do NOT use Strategy when:**
- You have only 2 variants that will never change — a simple `if-else` is fine
- The algorithms share 90% of their code — use Template Method instead
- The "algorithm" is really just a configuration value (don't create a class for `sortAscending = true`)

---

## 7. Common mistakes in interviews

| Mistake | Why it's wrong | What to do instead |
|---|---|---|
| **Making strategies stateful** | Strategies should ideally be stateless. If a strategy stores results from the last call, it becomes coupled to execution order. | Keep state in the Context. Strategies should be pure functions wrapped in a class. |
| **Hardcoding strategy selection in the Context** | Writing `if (mode == "rewards") strategy = new RankByRewards()` inside the Context defeats the purpose. | Let the client (or a Factory) decide which strategy to create and inject it. |
| **Using raw pointers without cleanup** | In C++, swapping strategies with `new` but no `delete` causes memory leaks. | Use `std::unique_ptr` as shown in the example above. |
| **Creating too many tiny strategies** | If each strategy is a one-liner, the overhead of separate classes isn't worth it. | For simple cases, use lambdas or function pointers. Reserve classes for strategies with meaningful logic. |
| **Forgetting to explain the interface** | Candidates jump to writing ConcreteStrategy classes without first defining the abstract interface. | Always start by defining the Strategy interface. The interviewer wants to see you think in abstractions. |

---

## 8. Related patterns

| Pattern | Relationship |
|---|---|
| **State** | Looks structurally similar (both use polymorphic delegation), but the intent is different. Strategy swaps algorithms chosen by the client. State changes behavior based on internal transitions — the object itself decides when to switch. |
| **Observer** | Often used alongside Strategy. For example, a pricing engine (Strategy) calculates a surge price, then an Observer notifies riders of the price change. |
| **Factory** | A Factory can be used to create the right Strategy based on configuration or user input, keeping the client clean. |
| **Template Method** | If your algorithms share 80% of their steps and only differ in 1-2 steps, Template Method (using inheritance) may be a better fit than Strategy (using composition). |
| **Decorator** | Strategy replaces the *entire* algorithm. Decorator wraps and *extends* behavior. In a discount engine, Strategy picks the discount type; Decorator stacks multiple discounts on top of each other. |

---

## 9. Practice problems in this repo

| Problem | Tier | Companies | How Strategy is used |
|---|---|---|---|
| [001 - Payment Method Ranker](../problems/tier1-foundation/001-payment-ranker/) | Foundation | Amazon, Flipkart | Swap ranking criteria (rewards, fees, speed) using Strategy |
| [005 - Customer Issue Resolver](../problems/tier1-foundation/005-issue-resolver/) | Foundation | PhonePe, Flipkart | Multiple agent assignment strategies (round-robin, skill-based, etc.) |
| [006 - Billing & Discount Engine](../problems/tier1-foundation/006-discount-engine/) | Foundation | Flipkart, Amazon, Meesho | Different discount calculation strategies |
| [008 - File Search System](../problems/tier1-foundation/008-file-search/) | Foundation | Amazon, Microsoft | Swap search criteria and sort strategies |
| [011 - API Rate Limiter](../problems/tier1-foundation/011-rate-limiter/) | Foundation | Amazon, Razorpay, Uber | Multiple rate limiting algorithms (fixed window, sliding window, token bucket) |
| [009 - Meeting Room Scheduler](../problems/tier2-intermediate/009-meeting-scheduler/) | Intermediate | Flipkart, Razorpay, Groww, Microsoft | Multiple room allocation strategies |
| [010 - Ride Surge Pricing](../problems/tier2-intermediate/010-ride-surge-pricing/) | Intermediate | Uber, Ola | Different surge pricing calculation strategies |

---

## Further reading

- [Refactoring Guru — Strategy](https://refactoring.guru/design-patterns/strategy)
- [GFG — Strategy Pattern](https://www.geeksforgeeks.org/strategy-pattern-set-1/)
