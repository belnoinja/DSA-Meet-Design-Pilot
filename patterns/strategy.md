# Strategy Pattern

## The one-line explanation

Define a family of algorithms, encapsulate each one, and make them interchangeable — so the client can swap behavior at runtime without changing its own code.

---

## When to use it

Use Strategy when:
- You have multiple variants of an algorithm (e.g., sort by price, sort by rewards, sort by speed)
- You want to switch between algorithms at runtime
- You want to eliminate conditionals like `if (mode == "cheapest") ... else if (mode == "fastest") ...`

---

## The structure

```
Context (uses a Strategy)
    └── Strategy (interface)
            ├── ConcreteStrategyA
            ├── ConcreteStrategyB
            └── ConcreteStrategyC
```

The **Context** holds a reference to a Strategy object. It delegates the behavior to whichever Strategy is currently set.

---

## C++ Example

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

// Strategy interface
class SortStrategy {
public:
    virtual void sort(std::vector<int>& data) = 0;
    virtual ~SortStrategy() = default;
};

// Concrete strategies
class AscendingSort : public SortStrategy {
public:
    void sort(std::vector<int>& data) override {
        std::sort(data.begin(), data.end());
    }
};

class DescendingSort : public SortStrategy {
public:
    void sort(std::vector<int>& data) override {
        std::sort(data.begin(), data.end(), std::greater<int>());
    }
};

// Context
class Sorter {
    SortStrategy* strategy;
public:
    Sorter(SortStrategy* s) : strategy(s) {}
    void setStrategy(SortStrategy* s) { strategy = s; }
    void sort(std::vector<int>& data) { strategy->sort(data); }
};
```

---

## Real-world analogies

- **Payment processing**: Credit card vs UPI vs wallet — same interface (`pay(amount)`), different implementations
- **Compression**: ZIP vs GZIP vs LZ4 — same interface (`compress(data)`), different algorithms
- **Navigation apps**: Fastest route vs shortest route vs avoid tolls — same interface (`route(from, to)`), different strategies

---

## The DSA connection

Strategy is often paired with **sorting comparators**. When you define a custom comparator, you're essentially passing a Strategy to the sort algorithm.

```cpp
// Comparator as a Strategy
auto byRewards = [](const Card& a, const Card& b) {
    return a.rewardRate > b.rewardRate;
};
std::sort(cards.begin(), cards.end(), byRewards);
```

---

## Common mistakes

1. **Making strategies stateful** — strategies should be stateless when possible; state belongs in the context
2. **Too many tiny strategies** — if you only have 2 variants that never change, just use an `if` statement
3. **Forgetting to delete** — in C++ without smart pointers, memory leaks when swapping strategies

---

## Further reading

- [Refactoring Guru — Strategy](https://refactoring.guru/design-patterns/strategy)
- [GFG — Strategy Pattern](https://www.geeksforgeeks.org/strategy-pattern-set-1/)
