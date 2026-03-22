# Problem 001 — Payment Method Ranker

**Tier:** 1 (Foundation) | **Pattern:** Strategy + Comparator | **DSA:** Sorting
**Companies:** Amazon, Flipkart | **Time:** 45 minutes

---

## Problem Statement

You're building the checkout page for an e-commerce platform. When a user is about to pay, the system must **rank their available payment methods** from most recommended to least recommended.

Different users have different ranking criteria:
- A **rewards maximizer** wants the card with the highest cashback rate first
- A **low-fee seeker** wants the option with the lowest transaction fee first
- A **trust-based** ranker wants the most commonly used payment method first (by usage count)

**Your task:** Design and implement a `PaymentRanker` class that can rank a list of payment methods using any of these strategies — and allows new strategies to be added without modifying the ranker itself.

---

## Before You Code

> Read this section carefully. This is where the design thinking happens.

**Ask yourself:**
1. What varies here? The *ranking algorithm* varies. The *ranker itself* stays the same.
2. If you used `if-else` inside `rank()`, what happens when a 4th strategy is added? You modify existing code — violating Open/Closed Principle.
3. How does the Strategy pattern solve this? Each ranking algorithm becomes a separate class implementing a common interface.

**The key insight:** A comparator *is* a strategy. When you pass a lambda or a comparator object to `std::sort`, you are already using the Strategy pattern implicitly.

---

## Data Structures

```cpp
struct PaymentMethod {
    std::string name;       // "HDFC Credit Card", "UPI", "Amazon Pay"
    double cashbackRate;    // 0.05 = 5% cashback
    double transactionFee;  // in rupees
    int usageCount;         // how many times user has used this method
};
```

---

## What to Implement

```cpp
// Strategy interface
class RankingStrategy {
public:
    virtual bool compare(const PaymentMethod& a, const PaymentMethod& b) = 0;
    virtual ~RankingStrategy() = default;
};

// Concrete strategies — you implement these:
class RewardsMaximizer : public RankingStrategy { ... };
class LowFeeSeeker    : public RankingStrategy { ... };
class TrustBased      : public RankingStrategy { ... };

// The ranker — takes any strategy
class PaymentRanker {
public:
    PaymentRanker(RankingStrategy* strategy);
    void setStrategy(RankingStrategy* strategy);
    std::vector<PaymentMethod> rank(std::vector<PaymentMethod> methods);
};
```

---

## Extensions (attempt these after the base implementation)

1. **Extension 1:** Add a `CompositeStrategy` that ranks by primary criterion first, breaks ties by secondary criterion (e.g., highest cashback, then lowest fee for ties).

2. **Extension 2:** The user has a "preferred" payment method. Add a `PreferredFirstStrategy` that always puts the preferred method at the top, then ranks the rest by rewards.

3. **Extension 3:** Add a `WeightedStrategy` that scores each payment method: `score = (cashbackRate * w1) - (transactionFee * w2) + (usageCount * w3)` where w1, w2, w3 are configurable weights.

---

## Running Tests

```bash
./run-tests.sh 001-payment-ranker cpp
```

Tests are in `tests/test_payment_ranker.cpp`.
