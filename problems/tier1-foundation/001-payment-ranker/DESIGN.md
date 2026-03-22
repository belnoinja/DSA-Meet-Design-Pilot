# Design Walkthrough — Payment Method Ranker

> This file is the answer guide. Only read after you've attempted the problem.

---

## The Core Design Decision

The problem has **one moving part**: the ranking algorithm. Everything else — the ranker class, the payment method struct, the list — is stable.

The Strategy pattern exists precisely for this: isolate the part that changes.

```
PaymentRanker (stable)
    └── RankingStrategy (interface — stable)
            ├── RewardsMaximizer  ← changes independently
            ├── LowFeeSeeker      ← changes independently
            └── TrustBased        ← changes independently
```

Adding a 4th strategy doesn't touch PaymentRanker or the other strategies. **This is Open/Closed Principle in action.**

---

## Reference Implementation

```cpp
#include <vector>
#include <algorithm>
#include <string>

struct PaymentMethod {
    std::string name;
    double cashbackRate;
    double transactionFee;
    int usageCount;
};

class RankingStrategy {
public:
    virtual bool compare(const PaymentMethod& a, const PaymentMethod& b) = 0;
    virtual ~RankingStrategy() = default;
};

class RewardsMaximizer : public RankingStrategy {
public:
    bool compare(const PaymentMethod& a, const PaymentMethod& b) override {
        return a.cashbackRate > b.cashbackRate;
    }
};

class LowFeeSeeker : public RankingStrategy {
public:
    bool compare(const PaymentMethod& a, const PaymentMethod& b) override {
        return a.transactionFee < b.transactionFee;
    }
};

class TrustBased : public RankingStrategy {
public:
    bool compare(const PaymentMethod& a, const PaymentMethod& b) override {
        return a.usageCount > b.usageCount;
    }
};

class PaymentRanker {
    RankingStrategy* strategy;
public:
    PaymentRanker(RankingStrategy* s) : strategy(s) {}
    void setStrategy(RankingStrategy* s) { strategy = s; }

    std::vector<PaymentMethod> rank(std::vector<PaymentMethod> methods) {
        std::sort(methods.begin(), methods.end(),
            [this](const PaymentMethod& a, const PaymentMethod& b) {
                return strategy->compare(a, b);
            });
        return methods;
    }
};
```

---

## Extension 1: CompositeStrategy

```cpp
class CompositeStrategy : public RankingStrategy {
    RankingStrategy* primary;
    RankingStrategy* secondary;
public:
    CompositeStrategy(RankingStrategy* p, RankingStrategy* s)
        : primary(p), secondary(s) {}

    bool compare(const PaymentMethod& a, const PaymentMethod& b) override {
        // If primary says a < b, return true
        // If primary says b < a, return false
        // If tie (neither), use secondary
        if (primary->compare(a, b)) return true;
        if (primary->compare(b, a)) return false;
        return secondary->compare(a, b);
    }
};
```

---

## What interviewers look for

1. **Did you name the pattern?** Say "Strategy pattern" out loud.
2. **Did you separate interface from implementation?** `RankingStrategy` is the contract; concrete classes fulfill it.
3. **Is your ranker closed for modification?** Adding a new strategy shouldn't touch `PaymentRanker`.
4. **Do you understand comparators?** Recognize that `std::sort`'s comparator parameter is already a Strategy slot.

---

## Common interview follow-ups

- *"What if you wanted to persist the user's preferred strategy?"* → Store strategy type as an enum in user profile, reconstruct on load
- *"What if strategies need configuration (e.g., minimum cashback threshold)?"* → Pass config in constructor, make strategy stateful
- *"How would you test this?"* → Test each strategy independently with controlled inputs; test ranker with mock strategy
