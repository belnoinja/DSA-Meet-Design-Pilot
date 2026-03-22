#include <iostream>
#include <vector>
#include <cmath>
#include <string>
using namespace std;

// ─── Strategy Interface ───────────────────────────────────────────────────────

class SurgeStrategy {
public:
    virtual double calculate(int demand, int supply) = 0;
    virtual string name() const = 0;
    virtual ~SurgeStrategy() = default;
};

// ─── TODO: Implement Surge Strategies ────────────────────────────────────────

class LinearSurge : public SurgeStrategy {
    double factor;
public:
    LinearSurge(double f = 0.5) : factor(f) {}
    double calculate(int demand, int supply) override {
        if (supply == 0) return 3.0;
        double ratio = (double)demand / supply;
        return max(1.0, 1.0 + (ratio - 1.0) * factor);
    }
    string name() const override { return "Linear"; }
};

class StepSurge : public SurgeStrategy {
public:
    double calculate(int demand, int supply) override {
        if (supply == 0) return 2.5;
        double ratio = (double)demand / supply;
        if (ratio < 1.0) return 1.0;
        if (ratio < 1.5) return 1.5;
        if (ratio < 2.0) return 2.0;
        return 2.5;
    }
    string name() const override { return "Step"; }
};

// ─── Observer Interface ───────────────────────────────────────────────────────

class SurgeObserver {
public:
    virtual void onSurgeChange(double oldMultiplier, double newMultiplier) = 0;
    virtual ~SurgeObserver() = default;
};

// ─── Concrete Observers ───────────────────────────────────────────────────────

class PricingDisplay : public SurgeObserver {
public:
    void onSurgeChange(double old_, double new_) override {
        cout << "[PricingDisplay] Multiplier updated: " << old_ << "x -> " << new_ << "x\n";
    }
};

class DriverIncentives : public SurgeObserver {
public:
    void onSurgeChange(double old_, double new_) override {
        if (new_ > old_)
            cout << "[DriverIncentives] Sending surge alerts to nearby drivers (" << new_ << "x)\n";
    }
};

// ─── TODO: Implement SurgePricingEngine ──────────────────────────────────────

class SurgePricingEngine {
    SurgeStrategy*           strategy;
    vector<SurgeObserver*>   observers;
    double                   currentMultiplier = 1.0;

public:
    SurgePricingEngine(SurgeStrategy* s) : strategy(s) {}

    void setStrategy(SurgeStrategy* s) { strategy = s; }
    void addObserver(SurgeObserver* obs) { observers.push_back(obs); }

    void updateMetrics(int demand, int supply) {
        double newMultiplier = strategy->calculate(demand, supply);
        if (abs(newMultiplier - currentMultiplier) > 0.001) {
            double old = currentMultiplier;
            currentMultiplier = newMultiplier;
            for (auto* obs : observers) obs->onSurgeChange(old, newMultiplier);
        }
    }

    double getCurrentMultiplier() const { return currentMultiplier; }
};

// ─── Main ────────────────────────────────────────────────────────────────────

int main() {
    LinearSurge    linearStrategy;
    StepSurge      stepStrategy;
    PricingDisplay display;
    DriverIncentives incentives;

    SurgePricingEngine engine(&linearStrategy);
    engine.addObserver(&display);
    engine.addObserver(&incentives);

    cout << "=== Linear Surge ===\n";
    engine.updateMetrics(10, 10);  // ratio 1.0 → no surge
    engine.updateMetrics(15, 10);  // ratio 1.5 → surge
    engine.updateMetrics(20, 10);  // ratio 2.0 → higher surge
    engine.updateMetrics(10, 10);  // back to normal

    cout << "\n=== Switching to Step Surge ===\n";
    engine.setStrategy(&stepStrategy);
    engine.updateMetrics(15, 10);  // ratio 1.5 → 1.5x step
    engine.updateMetrics(25, 10);  // ratio 2.5 → 2.5x step

    return 0;
}
