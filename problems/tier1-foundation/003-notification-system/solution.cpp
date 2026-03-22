#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

// ─── Data ────────────────────────────────────────────────────────────────────

enum class OrderEvent { ORDER_PLACED, ORDER_SHIPPED, ORDER_DELIVERED, ORDER_CANCELLED };

struct OrderInfo {
    string orderId;
    string customerId;
    string customerEmail;
    string customerPhone;
    double amount;
    OrderEvent event;
};

string eventName(OrderEvent e) {
    switch (e) {
        case OrderEvent::ORDER_PLACED:    return "ORDER_PLACED";
        case OrderEvent::ORDER_SHIPPED:   return "ORDER_SHIPPED";
        case OrderEvent::ORDER_DELIVERED: return "ORDER_DELIVERED";
        case OrderEvent::ORDER_CANCELLED: return "ORDER_CANCELLED";
    }
    return "UNKNOWN";
}

// ─── Observer Interface ───────────────────────────────────────────────────────

class NotificationHandler {
public:
    virtual void onEvent(const OrderInfo& order) = 0;
    virtual ~NotificationHandler() = default;
};

// ─── TODO: Implement Concrete Handlers ───────────────────────────────────────

class EmailNotifier : public NotificationHandler {
public:
    void onEvent(const OrderInfo& order) override {
        // TODO: simulate sending email
        cout << "[Email] Sent to " << order.customerEmail
             << " for event: " << eventName(order.event) << "\n";
    }
};

class SMSNotifier : public NotificationHandler {
public:
    void onEvent(const OrderInfo& order) override {
        // TODO: simulate sending SMS (only for PLACED and DELIVERED)
        cout << "[SMS] Sent to " << order.customerPhone
             << " for event: " << eventName(order.event) << "\n";
    }
};

// ─── TODO: Implement OrderEventBus ───────────────────────────────────────────

class OrderEventBus {
    // TODO: store subscribers per event type
    unordered_map<int, vector<NotificationHandler*>> subscribers;

public:
    void subscribe(OrderEvent event, NotificationHandler* handler) {
        // TODO
        subscribers[static_cast<int>(event)].push_back(handler);
    }

    void publish(const OrderInfo& order) {
        // TODO: notify all handlers subscribed to this event
        auto it = subscribers.find(static_cast<int>(order.event));
        if (it != subscribers.end()) {
            for (auto* h : it->second) h->onEvent(order);
        }
    }
};

// ─── Main ────────────────────────────────────────────────────────────────────

int main() {
    OrderEventBus bus;
    EmailNotifier email;
    SMSNotifier   sms;

    bus.subscribe(OrderEvent::ORDER_PLACED,    &email);
    bus.subscribe(OrderEvent::ORDER_PLACED,    &sms);
    bus.subscribe(OrderEvent::ORDER_DELIVERED, &email);
    bus.subscribe(OrderEvent::ORDER_DELIVERED, &sms);
    bus.subscribe(OrderEvent::ORDER_SHIPPED,   &email);

    OrderInfo order1{"ORD001", "USR1", "user@example.com", "+91-9999999999", 499.0, OrderEvent::ORDER_PLACED};
    OrderInfo order2{"ORD001", "USR1", "user@example.com", "+91-9999999999", 499.0, OrderEvent::ORDER_SHIPPED};

    cout << "=== Order Placed ===\n";
    bus.publish(order1);
    cout << "\n=== Order Shipped ===\n";
    bus.publish(order2);

    return 0;
}
