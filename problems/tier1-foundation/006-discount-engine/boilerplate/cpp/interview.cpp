#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

// ─── Data Model (given — do not modify) ─────────────────────────────────────

struct CartItem {
    string name;       // "Laptop", "Phone Case", "Headphones"
    double price;      // unit price in rupees
    int    quantity;   // number of units
    string category;   // "electronics", "accessories", "clothing"
};

// ─── Your Design Starts Here ─────────────────────────────────────────────────
//
// Design and implement a DiscountEngine that:
//   1. Applies discount strategies to a shopping cart
//   2. Allows new discount types to be added WITHOUT modifying
//      the engine itself
//
// Think about:
//   - What abstraction lets you swap discount logic at runtime?
//   - How would you add a 4th discount type with zero changes
//     to existing code?
//
// Entry points (must exist for tests):
//   double apply_percentage_discount(vector<CartItem> cart, double percentage);
//   double apply_flat_discount(vector<CartItem> cart, double amount);
//   double apply_bogo(vector<CartItem> cart, int buyCount, int freeCount);
//
// ─────────────────────────────────────────────────────────────────────────────


