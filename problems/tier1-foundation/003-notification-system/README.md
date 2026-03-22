# Problem 003 — Notification System

**Tier:** 1 (Foundation) | **Pattern:** Observer | **DSA:** Queue
**Companies:** Flipkart, Swiggy | **Time:** 45 minutes

---

## Problem Statement

You're building the notification backbone for an e-commerce platform. When an **order event** occurs (order placed, order shipped, order delivered), the system must notify multiple channels simultaneously:
- Email service
- SMS service
- Push notification service
- In-app notification service

New notification channels should be addable **without changing the event publishing code**.

---

## Before You Code

> Read this section carefully.

**Ask yourself:**
1. What's the relationship here? One event → many notifications. Classic one-to-many.
2. What's the naive approach? Call `sendEmail()`, `sendSMS()`, `sendPush()` explicitly inside the order handler. What happens when Slack notifications are added?
3. How does Observer solve this? The order system publishes events. Notification handlers *subscribe* to events they care about. The publisher doesn't know who's listening.

**The key insight:** The order system should not import or know about email/SMS/push services. Decoupling is the goal.

---

## Data Structures

```cpp
enum class OrderEvent {
    ORDER_PLACED,
    ORDER_SHIPPED,
    ORDER_DELIVERED,
    ORDER_CANCELLED
};

struct OrderInfo {
    std::string orderId;
    std::string customerId;
    std::string customerEmail;
    std::string customerPhone;
    double amount;
    OrderEvent event;
};
```

---

## What to Implement

```cpp
// Observer interface
class NotificationHandler {
public:
    virtual void onEvent(const OrderInfo& order) = 0;
    virtual ~NotificationHandler() = default;
};

// Concrete handlers — you implement these:
class EmailNotifier      : public NotificationHandler { ... };
class SMSNotifier        : public NotificationHandler { ... };
class PushNotifier       : public NotificationHandler { ... };
class InAppNotifier      : public NotificationHandler { ... };

// Subject (event bus)
class OrderEventBus {
public:
    void subscribe(OrderEvent event, NotificationHandler* handler);
    void unsubscribe(OrderEvent event, NotificationHandler* handler);
    void publish(const OrderInfo& order);
};
```

---

## Extensions

1. **Extension 1:** Not all handlers need all events. `SMSNotifier` only cares about `ORDER_PLACED` and `ORDER_DELIVERED`. Modify the bus so handlers subscribe to *specific* events, not all events.

2. **Extension 2:** Add a `QueuedEventBus` that doesn't call handlers immediately. Instead it pushes events to an internal queue and processes them in order with a `processNext()` method. (This simulates async processing.)

3. **Extension 3:** Add a `FilteredNotifier` that wraps another notifier and only forwards events where `order.amount > threshold`. (Decorator + Observer.)

---

## Running Tests

```bash
./run-tests.sh 003-notification-system cpp
```
