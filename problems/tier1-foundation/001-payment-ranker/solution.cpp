#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

// ─── Data Structure ──────────────────────────────────────────────────────────

struct PaymentMethod {
    string name;
    double cashbackRate;   // e.g. 0.05 = 5%
    double transactionFee; // in rupees
    int    usageCount;
};

// ─── Strategy Interface ───────────────────────────────────────────────────────

class RankingStrategy {
public:
    virtual bool compare(const PaymentMethod& a, const PaymentMethod& b) = 0;
    virtual ~RankingStrategy() = default;
};

// ─── TODO: Implement Concrete Strategies ─────────────────────────────────────

class RewardsMaximizer : public RankingStrategy {
public:
    bool compare(const PaymentMethod& a, const PaymentMethod& b) override {
        // TODO: rank by highest cashback rate
        return false;
    }
};

class LowFeeSeeker : public RankingStrategy {
public:
    bool compare(const PaymentMethod& a, const PaymentMethod& b) override {
        // TODO: rank by lowest transaction fee
        return false;
    }
};

class TrustBased : public RankingStrategy {
public:
    bool compare(const PaymentMethod& a, const PaymentMethod& b) override {
        // TODO: rank by highest usage count
        return false;
    }
};

// ─── TODO: Implement PaymentRanker ───────────────────────────────────────────

class PaymentRanker {
    RankingStrategy* strategy;
public:
    PaymentRanker(RankingStrategy* s) : strategy(s) {}
    void setStrategy(RankingStrategy* s) { strategy = s; }

    vector<PaymentMethod> rank(vector<PaymentMethod> methods) {
        // TODO: use strategy->compare to sort
        return methods;
    }
};

// ─── Main (test your implementation) ─────────────────────────────────────────

int main() {
    vector<PaymentMethod> methods = {
        {"HDFC Credit Card", 0.05, 2.0, 120},
        {"UPI",              0.00, 0.0, 450},
        {"Amazon Pay",       0.03, 0.0, 200},
        {"Debit Card",       0.01, 1.0,  80},
    };

    RewardsMaximizer rewardsStrategy;
    PaymentRanker ranker(&rewardsStrategy);

    auto ranked = ranker.rank(methods);
    cout << "Ranked by Rewards:\n";
    for (const auto& m : ranked) {
        cout << "  " << m.name << " (" << m.cashbackRate * 100 << "% cashback)\n";
    }

    return 0;
}
