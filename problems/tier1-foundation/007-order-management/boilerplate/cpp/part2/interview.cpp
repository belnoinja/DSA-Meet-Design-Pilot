#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
using namespace std;

// ─── Data Model (given — do not modify) ─────────────────────────────────────

enum class OrderState { Created, Confirmed, Shipped, Delivered, Cancelled };

struct OrderItem {
    string productId;
    int quantity;
};

struct Order {
    string id;
    vector<OrderItem> items;
    double totalAmount;
    OrderState state;
};

// ─── NEW in Extension 1 ────────────────────────────────────────────────────
//
// Orders can now be CANCELLED from Created or Confirmed state.
// Cancellation from Shipped or Delivered is NOT allowed.
// When cancelled, inventory must be released (restored).
//
// Think about:
//   - How do you track inventory per product? (HashMap)
//   - When should inventory be decremented? On order creation.
//   - When should inventory be restored? On cancellation.
//   - What if the order has multiple items?
//
// Entry points (must exist for tests):
//   string create_order(vector<OrderItem> items, double totalAmount);
//   bool confirm_order(const string& orderId);
//   bool ship_order(const string& orderId);
//   bool deliver_order(const string& orderId);
//   bool cancel_order(const string& orderId);
//   OrderState get_order_state(const string& orderId);
//   void set_inventory(const string& productId, int quantity);
//   int get_inventory(const string& productId);
//
// ─────────────────────────────────────────────────────────────────────────────


