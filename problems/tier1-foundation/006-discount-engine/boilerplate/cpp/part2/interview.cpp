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

// ─── NEW in Extension 1 ──────────────────────────────────────────────────────
//
// The product team now wants STACKED discounts:
// apply a coupon, then a seasonal discount on top, then membership on top.
//
// Think about:
//   - How do you chain discounts without modifying existing strategies?
//   - What if the product team adds a 5th discount layer tomorrow?
//   - Is your Part 1 design extensible enough to handle this?
//
// Entry points (must exist for tests):
//   double apply_percentage_discount(vector<CartItem> cart, double percentage);
//   double apply_flat_discount(vector<CartItem> cart, double amount);
//   double apply_bogo(vector<CartItem> cart, int buyCount, int freeCount);
//   double apply_stacked_discounts(vector<CartItem> cart,
//       vector<???> discounts);  // you decide the type
//
// ─────────────────────────────────────────────────────────────────────────────


