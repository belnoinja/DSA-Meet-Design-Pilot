#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>
using namespace std;

// ─── Data Structure ──────────────────────────────────────────────────────────

struct CartItem {
    string name;       // "Laptop", "Phone Case", "Headphones"
    double price;      // unit price in rupees
    int    quantity;   // number of units
    string category;   // "electronics", "accessories", "clothing"
};

// ─── Strategy Interface ───────────────────────────────────────────────────────

class Discount {
public:
    virtual double apply(const vector<CartItem>& cart) = 0;
    virtual ~Discount() = default;
};

// ─── TODO: Implement Concrete Strategies ─────────────────────────────────────

class PercentageDiscount : public Discount {
    double pct;
public:
    PercentageDiscount(double percentage) : pct(percentage) {}
    double apply(const vector<CartItem>& cart) override {
        // TODO: compute total, then reduce by pct%
        return 0;
    }
};

class FlatDiscount : public Discount {
    double amount;
public:
    FlatDiscount(double amt) : amount(amt) {}
    double apply(const vector<CartItem>& cart) override {
        // TODO: compute total, then subtract flat amount (min 0)
        return 0;
    }
};

class BuyXGetYDiscount : public Discount {
    int buyCount, freeCount;
public:
    BuyXGetYDiscount(int buy, int free) : buyCount(buy), freeCount(free) {}
    double apply(const vector<CartItem>& cart) override {
        // TODO: for each item, compute paid items using buy/free ratio
        return 0;
    }
};

// ─── TODO: Implement DiscountEngine ──────────────────────────────────────────

class DiscountEngine {
    Discount* discount;
public:
    DiscountEngine(Discount* d) : discount(d) {}
    void setDiscount(Discount* d) { discount = d; }

    double computeTotal(const vector<CartItem>& cart) {
        // TODO: use discount->apply to compute final total
        return 0;
    }
};

// ─── TODO: Implement StackedDiscount (Decorator) ─────────────────────────────

class StackedDiscount : public Discount {
    vector<Discount*> discounts;
public:
    StackedDiscount(vector<Discount*> d) : discounts(d) {}

    double apply(const vector<CartItem>& cart) override {
        // TODO: apply each discount sequentially to the running total
        return 0;
    }
};

// ─── TODO: Implement Eligibility Rules ───────────────────────────────────────

struct UserContext {
    bool isFirstTimeUser;
};

// ─── Test Entry Points ───────────────────────────────────────────────────────

double apply_percentage_discount(vector<CartItem> cart, double percentage) {
    PercentageDiscount d(percentage);
    return DiscountEngine(&d).computeTotal(cart);
}

double apply_flat_discount(vector<CartItem> cart, double amount) {
    FlatDiscount d(amount);
    return DiscountEngine(&d).computeTotal(cart);
}

double apply_bogo(vector<CartItem> cart, int buyCount, int freeCount) {
    BuyXGetYDiscount d(buyCount, freeCount);
    return DiscountEngine(&d).computeTotal(cart);
}

double apply_stacked_discounts(vector<CartItem> cart, vector<Discount*> discounts) {
    StackedDiscount d(discounts);
    return DiscountEngine(&d).computeTotal(cart);
}

double apply_with_eligibility(vector<CartItem> cart,
                              Discount* discount,
                              double minCartValue,
                              bool requireFirstTimeUser,
                              UserContext user,
                              string eligibleCategory) {
    // TODO: check eligibility rules, then apply discount
    return 0;
}

// ─── Main (test your implementation) ─────────────────────────────────────────

int main() {
    vector<CartItem> cart = {
        {"Laptop",     50000.0, 1, "electronics"},
        {"Phone Case",   500.0, 3, "accessories"},
        {"Headphones",  2000.0, 2, "electronics"},
    };

    cout << "10% discount: " << apply_percentage_discount(cart, 10.0) << endl;
    cout << "Rs.200 flat:  " << apply_flat_discount(cart, 200.0) << endl;
    cout << "Buy 2 Get 1:  " << apply_bogo(cart, 2, 1) << endl;

    return 0;
}
