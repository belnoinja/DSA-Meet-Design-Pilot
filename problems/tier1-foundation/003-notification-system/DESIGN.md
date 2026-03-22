# Design Walkthrough — Notification System

> Only read after attempting the problem.

---

## Reference Implementation

```cpp
#include <vector>
#include <unordered_map>
#include <queue>
#include <algorithm>

// Event bus with per-event subscriptions (Extension 1 included)
class OrderEventBus {
    std::unordered_map<OrderEvent, std::vector<NotificationHandler*>> subscribers;

public:
    void subscribe(OrderEvent event, NotificationHandler* handler) {
        subscribers[event].push_back(handler);
    }

    void unsubscribe(OrderEvent event, NotificationHandler* handler) {
        auto& handlers = subscribers[event];
        handlers.erase(
            std::remove(handlers.begin(), handlers.end(), handler),
            handlers.end()
        );
    }

    void publish(const OrderInfo& order) {
        auto it = subscribers.find(order.event);
        if (it != subscribers.end()) {
            for (auto* handler : it->second) {
                handler->onEvent(order);
            }
        }
    }
};
```

## Extension 2: QueuedEventBus

```cpp
class QueuedEventBus : public OrderEventBus {
    std::queue<OrderInfo> eventQueue;

public:
    void publish(const OrderInfo& order) override {
        eventQueue.push(order);  // don't notify yet
    }

    void processNext() {
        if (eventQueue.empty()) return;
        OrderInfo order = eventQueue.front();
        eventQueue.pop();
        OrderEventBus::publish(order);  // now notify
    }

    bool hasPending() const { return !eventQueue.empty(); }
};
```

---

## Why this matters in interviews

The Observer pattern question is really asking: *"Do you understand decoupling?"*

The answer they want to hear:
- Publisher (OrderEventBus) has zero knowledge of concrete handlers
- Adding a WhatsApp notifier = create a class, subscribe it — zero existing code changes
- The `unordered_map<OrderEvent, vector<Handler*>>` is the key data structure — O(1) lookup per event type
