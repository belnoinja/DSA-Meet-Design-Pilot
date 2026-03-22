# Problem 010 — Ride Surge Pricing Engine

**Tier:** 2 (Intermediate) | **Pattern:** Strategy + Observer | **DSA:** Priority Queue
**Companies:** Uber, Ola | **Time:** 60 minutes

---

## Problem Statement

Build a surge pricing engine for a ride-sharing platform. The system must:

1. Track supply (available drivers) and demand (ride requests) in real-time
2. Calculate a surge multiplier when demand exceeds supply
3. Apply different surge calculation strategies (linear, exponential, step-based)
4. Notify downstream systems (pricing display, driver incentives, analytics) when surge changes

---

## Before You Code

**Two patterns working together:**
- **Observer**: When surge multiplier changes, notify multiple downstream systems
- **Strategy**: The surge *calculation algorithm* is swappable

**The DSA angle:** Incoming ride requests and driver availability come from a priority queue ordered by proximity/time. The surge engine polls this queue to compute the demand/supply ratio.

---

## What to Implement

```cpp
// Strategy for surge calculation
class SurgeStrategy {
public:
    virtual double calculate(int demand, int supply) = 0;
    virtual ~SurgeStrategy() = default;
};

class LinearSurge      : public SurgeStrategy { ... }; // surge = 1.0 + (demand/supply - 1) * factor
class StepSurge        : public SurgeStrategy { ... }; // 1.0x, 1.5x, 2.0x, 2.5x thresholds
class ExponentialSurge : public SurgeStrategy { ... }; // surge = base ^ (demand/supply)

// Observer for surge changes
class SurgeObserver {
public:
    virtual void onSurgeChange(double oldMultiplier, double newMultiplier) = 0;
    virtual ~SurgeObserver() = default;
};

class PricingDisplay    : public SurgeObserver { ... };
class DriverIncentives  : public SurgeObserver { ... };
class AnalyticsSink     : public SurgeObserver { ... };

// The engine
class SurgePricingEngine {
public:
    SurgePricingEngine(SurgeStrategy* strategy);
    void setStrategy(SurgeStrategy* strategy);
    void addObserver(SurgeObserver* observer);
    void updateMetrics(int activeRequests, int availableDrivers);
    double getCurrentMultiplier() const;
};
```

---

## Running Tests

```bash
./run-tests.sh 010-ride-surge-pricing cpp
```
