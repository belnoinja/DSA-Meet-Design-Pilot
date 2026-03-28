# Observer Pattern

---

## 1. What is this pattern?

The Observer pattern sets up a **one-to-many relationship** between objects. When one object (the **Subject** or **Observable**) changes state, all objects that are "watching" it (the **Observers**) get notified automatically. The Subject doesn't need to know *who* is watching or *how many* are watching — it just broadcasts the change.

### Real-world analogy

Think about YouTube subscriptions. When a creator uploads a new video, every subscriber gets a notification. The creator doesn't personally message each subscriber — YouTube's notification system handles it. The creator (Subject) just says "new video is out," and every subscriber (Observer) gets pinged automatically. If someone unsubscribes, they stop getting notifications — no change needed on the creator's side.

Another example: Flipkart's "Notify Me" button for out-of-stock products. Multiple customers register interest. When the product is back in stock, all registered customers get an email/SMS. The inventory system (Subject) doesn't know anything about the email or SMS systems (Observers) — it just fires a "back in stock" event.

---

## 2. Why does it matter in interviews?

Observer is the **second most common pattern** in LLD interviews, right after Strategy. Here's why interviewers love it:

- **It tests decoupling.** The #1 design skill interviewers evaluate is whether you can keep components independent. Observer is the purest expression of loose coupling — the Subject and Observers know nothing about each other's internals.
- **It's in every notification-related problem.** "Send an email when X happens," "Notify the dashboard when Y changes," "Alert the user when Z is back in stock" — all of these scream Observer.
- **It's the follow-up trap.** Interviewers start with a simple system, then say: *"Now also send a push notification"* or *"Now also update the analytics dashboard."* If your code has the notification logic hardcoded, you're stuck. If you used Observer, you just add a new Observer class.
- **It connects to real systems.** Event-driven architecture, message queues (Kafka, RabbitMQ), webhooks — all are Observer at their core. Knowing the pattern shows system design maturity.

At Amazon, Flipkart, Swiggy, and similar companies, notification/event systems are asked in almost every LLD round.

---

## 3. The problem it solves — what breaks without it

### The "before" code: tight coupling

Imagine you're building an order management system. When an order is placed, you need to send an email and update the inventory.

```cpp
// BAD: Without Observer pattern
class OrderService {
public:
    void placeOrder(const Order& order) {
        // Core business logic
        saveToDatabase(order);

        // Notification logic — tightly coupled
        EmailService email;
        email.sendConfirmation(order.customerEmail, order.id);

        InventoryService inventory;
        inventory.reduceStock(order.itemId, order.quantity);

        // Boss says: "Also send an SMS"
        SMSService sms;
        sms.sendOrderSMS(order.customerPhone, order.id);

        // Boss says: "Also update the analytics dashboard"
        AnalyticsService analytics;
        analytics.trackOrder(order);

        // This class now depends on 4 unrelated services
        // Every new requirement = modify this class
        // Can't test placeOrder() without mocking all services
    }
};
```

**What breaks:**
- OrderService is **coupled** to EmailService, SMSService, InventoryService, and AnalyticsService
- Adding a new notification channel means **modifying** OrderService — violates Open/Closed Principle
- You can't test order placement without setting up (or mocking) every single notification service
- If the SMS service is slow or crashes, it blocks the entire order flow

### The "after" code: Observer pattern

```cpp
// GOOD: With Observer pattern
class OrderObserver {
public:
    virtual void onOrderPlaced(const Order& order) = 0;
    virtual ~OrderObserver() = default;
};

class OrderService {
    std::vector<OrderObserver*> observers_;
public:
    void subscribe(OrderObserver* obs) { observers_.push_back(obs); }
    void unsubscribe(OrderObserver* obs) {
        observers_.erase(
            std::remove(observers_.begin(), observers_.end(), obs),
            observers_.end());
    }

    void placeOrder(const Order& order) {
        saveToDatabase(order);
        // Notify all observers — OrderService doesn't know who they are
        for (auto* obs : observers_) {
            obs->onOrderPlaced(order);
        }
    }
};

// Each observer is independent — add/remove without touching OrderService
class EmailNotifier : public OrderObserver {
public:
    void onOrderPlaced(const Order& order) override {
        std::cout << "Email sent to " << order.customerEmail << std::endl;
    }
};

class SMSNotifier : public OrderObserver {
public:
    void onOrderPlaced(const Order& order) override {
        std::cout << "SMS sent to " << order.customerPhone << std::endl;
    }
};

// New requirement? Just add a new class. Zero changes to OrderService.
class AnalyticsTracker : public OrderObserver {
public:
    void onOrderPlaced(const Order& order) override {
        std::cout << "Analytics tracked for order " << order.id << std::endl;
    }
};
```

**What improved:**
- OrderService knows *nothing* about emails, SMS, or analytics
- Adding a new notification channel = adding a new class, zero changes to OrderService
- Each observer can be tested independently
- Observers can be added/removed at runtime (e.g., user opts out of SMS)

---

## 4. UML / Structure

```
┌──────────────────────────────┐
│        Subject               │
│──────────────────────────────│
│ - observers: Observer[]      │
│──────────────────────────────│
│ + subscribe(Observer)        │
│ + unsubscribe(Observer)      │         ┌────────────────────────────┐
│ + notify()                   │────────>│    <<interface>>            │
│   → for each obs:            │ calls   │       Observer              │
│       obs->update(data)      │         │────────────────────────────│
└──────────────────────────────┘         │ + update(data): void       │
                                         └──────────┬─────────────────┘
                                                    │ implements
                                          ┌─────────┼──────────┐
                                   ┌──────┴────┐┌───┴─────┐┌───┴──────────┐
                                   │ObserverA  ││ObserverB││  ObserverC   │
                                   │───────────││─────────││──────────────│
                                   │+update()  ││+update()││+update()     │
                                   └───────────┘└─────────┘└──────────────┘
```

**Key relationships:**
- **Subject** maintains a list of Observers and provides subscribe/unsubscribe methods.
- **Observer** is an abstract interface with an `update()` method.
- **ConcreteObservers** implement the interface — each handles the notification differently.
- The Subject calls `notify()`, which loops through all registered Observers and calls their `update()`.

### Push vs. Pull model

- **Push model** (shown above): The Subject sends all relevant data in the `update()` call. Observer gets everything it needs.
- **Pull model**: The Subject just says "something changed," and the Observer queries the Subject for specific data it needs. More flexible but more coupled.

In interviews, the **push model** is preferred because it's simpler and keeps Observers decoupled from the Subject's internals.

---

## 5. C++ Implementation — Complete, compilable example

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <memory>
#include <unordered_map>

// ─────────────────────────────────────────────────────────
// DOMAIN: Event types and event data
// ─────────────────────────────────────────────────────────
enum class EventType {
    ORDER_PLACED,
    ORDER_SHIPPED,
    ORDER_DELIVERED
};

// Helper to convert EventType to string for printing
std::string eventToString(EventType e) {
    switch (e) {
        case EventType::ORDER_PLACED:    return "ORDER_PLACED";
        case EventType::ORDER_SHIPPED:   return "ORDER_SHIPPED";
        case EventType::ORDER_DELIVERED: return "ORDER_DELIVERED";
    }
    return "UNKNOWN";
}

struct OrderEvent {
    EventType type;
    std::string orderId;
    std::string customerEmail;
    std::string customerPhone;
};

// ─────────────────────────────────────────────────────────
// STEP 1: Define the Observer interface
// Any class that wants to react to order events must
// implement this interface.
// ─────────────────────────────────────────────────────────
class OrderObserver {
public:
    virtual void onEvent(const OrderEvent& event) = 0;
    virtual ~OrderObserver() = default;
};

// ─────────────────────────────────────────────────────────
// STEP 2: Define the Subject (Observable)
// Manages the list of observers and notifies them.
// ─────────────────────────────────────────────────────────
class OrderEventBus {
    // Map from EventType to list of observers interested in that event
    // This allows observers to subscribe to SPECIFIC events
    std::unordered_map<int, std::vector<OrderObserver*>> listeners_;

public:
    // Subscribe to a specific event type
    void subscribe(EventType type, OrderObserver* observer) {
        listeners_[static_cast<int>(type)].push_back(observer);
    }

    // Unsubscribe from a specific event type
    void unsubscribe(EventType type, OrderObserver* observer) {
        auto& vec = listeners_[static_cast<int>(type)];
        vec.erase(std::remove(vec.begin(), vec.end(), observer), vec.end());
    }

    // Notify all observers subscribed to this event type
    void publish(const OrderEvent& event) {
        int key = static_cast<int>(event.type);
        if (listeners_.find(key) != listeners_.end()) {
            for (auto* observer : listeners_[key]) {
                observer->onEvent(event);
            }
        }
    }
};

// ─────────────────────────────────────────────────────────
// STEP 3: Create concrete observers
// Each one handles the event in its own way.
// They are completely independent of each other.
// ─────────────────────────────────────────────────────────

class EmailNotifier : public OrderObserver {
public:
    void onEvent(const OrderEvent& event) override {
        std::cout << "[EMAIL] To: " << event.customerEmail
                  << " | Event: " << eventToString(event.type)
                  << " | Order: " << event.orderId << std::endl;
    }
};

class SMSNotifier : public OrderObserver {
public:
    void onEvent(const OrderEvent& event) override {
        std::cout << "[SMS] To: " << event.customerPhone
                  << " | Event: " << eventToString(event.type)
                  << " | Order: " << event.orderId << std::endl;
    }
};

class PushNotifier : public OrderObserver {
public:
    void onEvent(const OrderEvent& event) override {
        std::cout << "[PUSH] Event: " << eventToString(event.type)
                  << " | Order: " << event.orderId << std::endl;
    }
};

class AnalyticsTracker : public OrderObserver {
public:
    void onEvent(const OrderEvent& event) override {
        std::cout << "[ANALYTICS] Tracked: " << eventToString(event.type)
                  << " for order " << event.orderId << std::endl;
    }
};

// ─────────────────────────────────────────────────────────
// STEP 4: Client code — wire up observers and fire events
// ─────────────────────────────────────────────────────────
int main() {
    // Create the event bus (Subject)
    OrderEventBus eventBus;

    // Create observers
    EmailNotifier email;
    SMSNotifier sms;
    PushNotifier push;
    AnalyticsTracker analytics;

    // Subscribe observers to specific events
    eventBus.subscribe(EventType::ORDER_PLACED, &email);
    eventBus.subscribe(EventType::ORDER_PLACED, &sms);
    eventBus.subscribe(EventType::ORDER_PLACED, &analytics);

    eventBus.subscribe(EventType::ORDER_SHIPPED, &email);
    eventBus.subscribe(EventType::ORDER_SHIPPED, &push);

    eventBus.subscribe(EventType::ORDER_DELIVERED, &push);

    // Simulate order lifecycle
    std::cout << "=== Order Placed ===" << std::endl;
    eventBus.publish({EventType::ORDER_PLACED, "ORD-001",
                      "user@example.com", "+91-9876543210"});

    std::cout << "\n=== Order Shipped ===" << std::endl;
    eventBus.publish({EventType::ORDER_SHIPPED, "ORD-001",
                      "user@example.com", "+91-9876543210"});

    std::cout << "\n=== Order Delivered ===" << std::endl;
    eventBus.publish({EventType::ORDER_DELIVERED, "ORD-001",
                      "user@example.com", "+91-9876543210"});

    // Unsubscribe SMS and fire another event — SMS won't be notified
    std::cout << "\n=== After SMS unsubscribe: Order Placed ===" << std::endl;
    eventBus.unsubscribe(EventType::ORDER_PLACED, &sms);
    eventBus.publish({EventType::ORDER_PLACED, "ORD-002",
                      "user2@example.com", "+91-1234567890"});

    return 0;
}
```

**Expected output:**
```
=== Order Placed ===
[EMAIL] To: user@example.com | Event: ORDER_PLACED | Order: ORD-001
[SMS] To: +91-9876543210 | Event: ORDER_PLACED | Order: ORD-001
[ANALYTICS] Tracked: ORDER_PLACED for order ORD-001

=== Order Shipped ===
[EMAIL] To: user@example.com | Event: ORDER_SHIPPED | Order: ORD-001
[PUSH] Event: ORDER_SHIPPED | Order: ORD-001

=== Order Delivered ===
[PUSH] Event: ORDER_DELIVERED | Order: ORD-001

=== After SMS unsubscribe: Order Placed ===
[EMAIL] To: user2@example.com | Event: ORDER_PLACED | Order: ORD-002
[ANALYTICS] Tracked: ORDER_PLACED for order ORD-002
```

### The DSA connection

Observer pairs naturally with **Queues** and **event-driven systems**. Instead of polling ("has anything changed?"), observers are pushed updates. This is the foundation of:

- **Message queues** (Kafka, RabbitMQ) — producers publish events, consumers subscribe
- **Pub/Sub systems** — Google Cloud Pub/Sub, AWS SNS
- **Reactive programming** — RxJava, RxJS

In interviews, if the problem involves "when X happens, do Y and Z," that's a Queue + Observer combination.

---

## 6. When to use it — Checklist

Use Observer when you see **any** of these signals:

- [ ] "When X happens, notify/update Y" — the word "notify" is a dead giveaway
- [ ] A change in one object requires updating multiple other objects
- [ ] You don't know in advance how many objects need to be notified (could be 1 or 100)
- [ ] You want to add new notification channels without modifying the core system
- [ ] The interviewer says "now also send a push notification" or "now also update the dashboard"
- [ ] You're building an event-driven or reactive system

**Do NOT use Observer when:**
- There's only one observer that will never change — just call it directly
- The notification must be guaranteed (Observer doesn't guarantee delivery — use a message queue for that)
- You need synchronous request-response — Observer is fire-and-forget by nature

---

## 7. Common mistakes in interviews

| Mistake | Why it's wrong | What to do instead |
|---|---|---|
| **Memory leaks / dangling pointers** | In C++, if an Observer is destroyed without unsubscribing, the Subject holds a dangling pointer. Next `notify()` call = crash. | Always unsubscribe in the Observer's destructor, or use `std::weak_ptr`. |
| **Cascading / circular updates** | Observer A's `update()` modifies Subject B, which notifies Observer A again. Infinite loop. | Avoid having observers modify other subjects in their `update()` method. If unavoidable, add a "processing" flag to break cycles. |
| **Assuming notification order** | Writing code that depends on EmailNotifier being called before SMSNotifier. The pattern makes no order guarantees. | Each observer should be independent. If order matters, use a priority mechanism explicitly. |
| **Putting business logic in notify()** | Making the `notify()` method do more than just loop through observers — like filtering, transforming, or handling errors. | Keep `notify()` simple: loop and call. Put filtering logic in the observers themselves or in a middleware layer. |
| **Not supporting unsubscribe** | Forgetting the `unsubscribe()` method entirely. Interviewers will ask "what if a user disables SMS notifications?" | Always implement both subscribe and unsubscribe. It's part of the pattern's contract. |

---

## 8. Related patterns

| Pattern | Relationship |
|---|---|
| **Strategy** | Often used together. Strategy picks *which* algorithm to use; Observer broadcasts *when* something happens. Example: a surge pricing engine (Strategy) calculates the price, then Observer notifies all riders. |
| **State** | State transitions in a State pattern can trigger Observer notifications. Example: when an order moves from "Shipped" to "Delivered," notify the customer via Observer. |
| **Mediator** | Similar to Observer but more centralized. In Mediator, components communicate through a central hub. In Observer, the Subject is the hub but observers don't communicate with each other. Use Mediator when observers need to coordinate. |
| **Command** | Commands can be queued and processed by observers. A command bus is essentially Observer + Command. |

---

## 9. Practice problems in this repo

| Problem | Tier | Companies | How Observer is used |
|---|---|---|---|
| [003 - Notification System](../problems/tier1-foundation/003-notification-system/) | Foundation | Flipkart, Swiggy | Multi-channel notifications (email, SMS, push) triggered by events |
| [005 - Customer Issue Resolver](../problems/tier1-foundation/005-issue-resolver/) | Foundation | PhonePe, Flipkart | Notify agents/customers when issue state changes |
| [009 - Meeting Room Scheduler](../problems/tier2-intermediate/009-meeting-scheduler/) | Intermediate | Flipkart, Razorpay, Groww, Microsoft | Notify attendees when meetings are booked/cancelled |
| [010 - Ride Surge Pricing](../problems/tier2-intermediate/010-ride-surge-pricing/) | Intermediate | Uber, Ola | Notify riders when surge pricing changes |

---

## Further reading

- [Refactoring Guru — Observer](https://refactoring.guru/design-patterns/observer)
- [GFG — Observer Pattern](https://www.geeksforgeeks.org/observer-pattern-set-1-introduction/)
