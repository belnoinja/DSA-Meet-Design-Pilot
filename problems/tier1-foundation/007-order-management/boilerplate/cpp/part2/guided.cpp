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

// ─── OrderManager ───────────────────────────────────────────────────────────
// HINT: You now need TWO HashMaps:
//   - orders: unordered_map<string, Order>      — order lookup by ID
//   - inventory: unordered_map<string, int>      — stock count by product ID
//
// On createOrder: decrement inventory for each item
// On cancelOrder: restore inventory for each item (only if state is Created or Confirmed)

// class OrderManager {
//     unordered_map<string, Order> orders;
//     unordered_map<string, int> inventory;
//     int nextId = 1;
// public:
//     void setInventory(const string& productId, int qty);
//     int getInventory(const string& productId);
//     string createOrder(vector<OrderItem> items, double totalAmount);
//     bool confirmOrder(const string& orderId);
//     bool shipOrder(const string& orderId);
//     bool deliverOrder(const string& orderId);
//     bool cancelOrder(const string& orderId);    // NEW
//     OrderState getOrderState(const string& orderId);
// };

// HINT: cancelOrder should:
//   1. Check the order exists
//   2. Check state is Created or Confirmed
//   3. Iterate through order items and restore inventory
//   4. Set state to Cancelled

// ─── Test Entry Points (must exist for tests to compile) ────────────────────
//
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

