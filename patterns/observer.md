# Observer Pattern

## The one-line explanation

Define a one-to-many dependency so that when one object changes state, all its dependents are notified and updated automatically.

---

## When to use it

Use Observer when:
- A change in one object requires updating others, and you don't know how many objects need to change
- You want loose coupling between the subject and its dependents
- You're building event systems, notification systems, or reactive UIs

---

## The structure

```
Subject (Observable)
    ├── attach(Observer)
    ├── detach(Observer)
    └── notify()
            └── calls update() on each Observer

Observer (interface)
    └── update()
            ├── ConcreteObserverA
            └── ConcreteObserverB
```

---

## C++ Example

```cpp
#include <iostream>
#include <vector>
#include <string>

// Observer interface
class Observer {
public:
    virtual void update(const std::string& event) = 0;
    virtual ~Observer() = default;
};

// Subject
class EventBus {
    std::vector<Observer*> observers;
public:
    void subscribe(Observer* obs) { observers.push_back(obs); }
    void unsubscribe(Observer* obs) {
        observers.erase(
            std::remove(observers.begin(), observers.end(), obs),
            observers.end()
        );
    }
    void publish(const std::string& event) {
        for (auto* obs : observers) obs->update(event);
    }
};

// Concrete observers
class EmailNotifier : public Observer {
public:
    void update(const std::string& event) override {
        std::cout << "Email sent for: " << event << "\n";
    }
};

class SMSNotifier : public Observer {
public:
    void update(const std::string& event) override {
        std::cout << "SMS sent for: " << event << "\n";
    }
};
```

---

## Real-world analogies

- **News subscriptions**: You subscribe to a newspaper; when a new edition is published, it's delivered to all subscribers
- **Stock ticker**: Multiple displays (mobile, web, TV) update when a stock price changes
- **Order tracking**: When an order ships, Email, SMS, and push notification all fire

---

## The DSA connection

Observer pairs naturally with **Queues** and **event-driven systems**. Instead of polling ("has anything changed?"), observers are pushed updates — this is the foundation of message queues, pub/sub systems, and reactive programming.

---

## Common mistakes

1. **Memory leaks** — forgetting to unsubscribe observers before they're destroyed (dangling pointers in C++)
2. **Cascading updates** — Observer A's `update()` triggers Subject B, which notifies Observer A again → infinite loop
3. **Order dependence** — assuming observers are called in a specific order (don't rely on this)

---

## Further reading

- [Refactoring Guru — Observer](https://refactoring.guru/design-patterns/observer)
- [GFG — Observer Pattern](https://www.geeksforgeeks.org/observer-pattern-set-1-introduction/)
