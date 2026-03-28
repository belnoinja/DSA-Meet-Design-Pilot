#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

// ─── Data Model (given — do not modify) ─────────────────────────────────────

struct CartItem {
    string name;
    double price;
    int    quantity;
    string category;
};

// ─── Discount Interface ─────────────────────────────────────────────────────
// HINT: This interface lets you swap discount logic at runtime.
// What method signature would let you compute a discounted total?

class /* YourInterfaceName */ {
public:
    virtual double /* yourMethodName */(const vector<CartItem>& cart) = 0;
    virtual ~/* YourInterfaceName */() = default;
};

// ─── Concrete Strategies ─────────────────────────────────────────────────────
// TODO: Implement a strategy for each discount type:
//   - Percentage discount (reduce total by X%)
//   - Flat discount (subtract fixed amount, minimum 0)
//   - Buy-X-Get-Y (for every X+Y items, Y are free)


// ─── Engine ──────────────────────────────────────────────────────────────────
// TODO: Implement a DiscountEngine class that:
//   - Accepts any discount strategy (via constructor or setter)
//   - Has a computeTotal() method that returns the discounted amount
//   - Does NOT know about specific discount types

// class DiscountEngine {
// public:
//     DiscountEngine(/* what goes here? */);
//     double computeTotal(const vector<CartItem>& cart);
// };


// ─── Test Entry Points (must exist for tests to compile) ─────────────────────
// Your solution must provide these functions:
//
//   double apply_percentage_discount(vector<CartItem> cart, double percentage);
//   double apply_flat_discount(vector<CartItem> cart, double amount);
//   double apply_bogo(vector<CartItem> cart, int buyCount, int freeCount);
//
// How you implement them internally is up to you.
// ─────────────────────────────────────────────────────────────────────────────

