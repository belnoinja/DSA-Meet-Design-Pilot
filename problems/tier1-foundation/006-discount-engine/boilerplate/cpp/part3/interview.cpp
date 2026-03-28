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

// ─── NEW in Extension 2 ──────────────────────────────────────────────────────
//
// The compliance team wants to add eligibility rules for discounts:
// - Minimum cart value threshold
// - First-time user only
// - Category-specific discounts (only items in a certain category)
//
// Think about:
//   - Are eligibility rules a new discount type, a decorator, or a filter?
//   - How does your existing design accommodate this without modification?
//   - What if the eligibility rules themselves need to be composable?
//
// Entry points (must exist for tests):
//   double apply_percentage_discount(vector<CartItem>, double);
//   double apply_flat_discount(vector<CartItem>, double);
//   double apply_bogo(vector<CartItem>, int, int);
//   double apply_stacked_discounts(vector<CartItem>, vector<???> discounts);
//   double apply_with_eligibility(vector<CartItem>, Discount*, double minCartValue,
//       bool requireFirstTimeUser, UserContext user, string eligibleCategory);
//
// ─────────────────────────────────────────────────────────────────────────────


