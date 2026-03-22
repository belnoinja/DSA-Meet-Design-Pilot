# Design Walkthrough — Ride Surge Pricing Engine

> Only read after attempting the problem.

---

## How Strategy + Observer compose

```
SurgePricingEngine
    ├── SurgeStrategy* (swappable — LinearSurge / StepSurge / ExponentialSurge)
    └── vector<SurgeObserver*> (PricingDisplay, DriverIncentives, AnalyticsSink)

updateMetrics(demand, supply):
    newMultiplier = strategy->calculate(demand, supply)
    if newMultiplier != currentMultiplier:
        notify all observers
        currentMultiplier = newMultiplier
```

The engine orchestrates — it doesn't implement either pattern directly. It *uses* a Strategy and *is* an Observable.

---

## Step surge implementation

```cpp
class StepSurge : public SurgeStrategy {
    std::vector<std::pair<double, double>> steps;
    // {ratio_threshold, multiplier}: [(1.0, 1.0), (1.5, 1.5), (2.0, 2.0), (3.0, 2.5)]
public:
    StepSurge(std::vector<std::pair<double, double>> s) : steps(std::move(s)) {}

    double calculate(int demand, int supply) override {
        if (supply == 0) return steps.back().second;
        double ratio = static_cast<double>(demand) / supply;
        double multiplier = 1.0;
        for (auto& [threshold, mult] : steps) {
            if (ratio >= threshold) multiplier = mult;
        }
        return multiplier;
    }
};
```

---

## Interview follow-ups

- *"How do you prevent surge oscillation?"* → Hysteresis: only increase surge if demand/supply ratio is high for N consecutive samples
- *"How would you cap surge at 3x for regulatory reasons?"* → Wrap any strategy in a `CappedSurge` decorator
- *"How would different cities have different surge configs?"* → Factory creates the right strategy per city; engine is unaware of geography
