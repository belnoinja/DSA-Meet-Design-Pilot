# Design Walkthrough — Billing & Discount Engine

> This file is the answer guide. Only read after you've attempted the problem.

---

## The Core Design Decision

The problem has **two moving parts**:
1. The *discount algorithm* (Part 1) — solved by **Strategy pattern**
2. The *discount composition* (Part 2) — solved by **Decorator pattern**

```
DiscountEngine (stable)
    └── Discount (interface — stable)
            ├── PercentageDiscount   ← Strategy
            ├── FlatDiscount         ← Strategy
            ├── BuyXGetYDiscount     ← Strategy
            └── StackedDiscount      ← Decorator (wraps other Discounts)
```

Adding a 4th discount type doesn't touch `DiscountEngine` or the other strategies. **This is Open/Closed Principle in action.**

---

## Reference Implementation

```cpp
#include <vector>
#include <algorithm>
#include <string>
#include <unordered_map>

struct CartItem {
    std::string name;
    double price;
    int quantity;
    std::string category;
};

// ─── Strategy Interface ─────────────────────────────────────────────────────

class Discount {
public:
    virtual double apply(const std::vector<CartItem>& cart) = 0;
    virtual ~Discount() = default;
};

// ─── Concrete Strategies ────────────────────────────────────────────────────

class PercentageDiscount : public Discount {
    double pct;
public:
    PercentageDiscount(double percentage) : pct(percentage) {}
    double apply(const std::vector<CartItem>& cart) override {
        double total = 0;
        for (auto& item : cart) total += item.price * item.quantity;
        return total * (1.0 - pct / 100.0);
    }
};

class FlatDiscount : public Discount {
    double amount;
public:
    FlatDiscount(double amt) : amount(amt) {}
    double apply(const std::vector<CartItem>& cart) override {
        double total = 0;
        for (auto& item : cart) total += item.price * item.quantity;
        return std::max(0.0, total - amount);
    }
};

class BuyXGetYDiscount : public Discount {
    int buyCount, freeCount;
public:
    BuyXGetYDiscount(int buy, int free) : buyCount(buy), freeCount(free) {}
    double apply(const std::vector<CartItem>& cart) override {
        double total = 0;
        for (auto& item : cart) {
            int groups = item.quantity / (buyCount + freeCount);
            int remainder = item.quantity % (buyCount + freeCount);
            int paidItems = groups * buyCount + std::min(remainder, buyCount);
            total += item.price * paidItems;
        }
        return total;
    }
};

// ─── Billing Engine ─────────────────────────────────────────────────────────

class DiscountEngine {
    Discount* discount;
public:
    DiscountEngine(Discount* d) : discount(d) {}
    void setDiscount(Discount* d) { discount = d; }
    double computeTotal(const std::vector<CartItem>& cart) {
        return discount->apply(cart);
    }
};
```

---

## Extension 1: StackedDiscount (Decorator)

```cpp
class StackedDiscount : public Discount {
    std::vector<Discount*> discounts;
public:
    StackedDiscount(std::vector<Discount*> d) : discounts(d) {}

    double apply(const std::vector<CartItem>& cart) override {
        double current = 0;
        for (auto& item : cart) current += item.price * item.quantity;

        for (auto* d : discounts) {
            // Create a single-item cart with the running total
            // so each discount applies to the result of the previous
            std::vector<CartItem> temp = {{"subtotal", current, 1, ""}};
            current = d->apply(temp);
        }
        return current;
    }
};
```

---

## Extension 2: Eligibility Rules

```cpp
struct UserContext {
    bool isFirstTimeUser;
};

double apply_with_eligibility(std::vector<CartItem> cart,
                              Discount* discount,
                              double minCartValue,
                              bool requireFirstTimeUser,
                              UserContext user,
                              std::string eligibleCategory) {
    double rawTotal = 0;
    for (auto& item : cart) rawTotal += item.price * item.quantity;

    // Rule 1: minimum cart value
    if (rawTotal < minCartValue) return rawTotal;

    // Rule 2: first-time user only
    if (requireFirstTimeUser && !user.isFirstTimeUser) return rawTotal;

    // Rule 3: category-specific
    if (!eligibleCategory.empty()) {
        std::vector<CartItem> eligible, ineligible;
        for (auto& item : cart) {
            if (item.category == eligibleCategory)
                eligible.push_back(item);
            else
                ineligible.push_back(item);
        }
        double discountedPart = discount->apply(eligible);
        double fullPricePart = 0;
        for (auto& item : ineligible) fullPricePart += item.price * item.quantity;
        return discountedPart + fullPricePart;
    }

    return discount->apply(cart);
}
```

---

## What interviewers look for

1. **Did you name the patterns?** Say "Strategy pattern" for Part 1, "Decorator pattern" for Part 2.
2. **Did you separate interface from implementation?** `Discount` is the contract; concrete classes fulfill it.
3. **Is your engine closed for modification?** Adding a new discount type shouldn't touch `DiscountEngine`.
4. **Do you understand Decorator vs Strategy?** Strategy selects *one* algorithm; Decorator *composes* multiple.
5. **Can you handle edge cases?** Zero cart, discount exceeding total, empty category filter.

---

## Common interview follow-ups

- *"What if you wanted to persist discount rules in a database?"* → Store discount type as an enum + config params, reconstruct on load
- *"What if discounts need a maximum cap?"* → Add a `CappedDiscount` decorator that clamps the discount amount
- *"How would you test this?"* → Test each strategy independently with controlled inputs; test stacking with known intermediate values
