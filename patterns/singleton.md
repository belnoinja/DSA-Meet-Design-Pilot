# Singleton Pattern

---

## 1. What is this pattern?

The Singleton pattern ensures that a class has **exactly one instance** throughout the entire application, and provides a **global point of access** to it. No matter how many times you ask for the instance, you always get the same one.

### Real-world analogy

Think about the **database connection pool** in any backend service. Your application has 50 API endpoints, and each one needs to talk to the database. You don't want 50 separate connection pools — that would exhaust the database. You want ONE pool that everyone shares. That pool is a Singleton.

Another example: India has ONE Reserve Bank of India (RBI). No matter which bank, which state, which department needs to interact with the central bank — they all interact with the same single RBI. You can't create a second RBI. That's Singleton.

Or think about a **Logger** in any application. Every module — user service, payment service, notification service — writes logs. They all write to the same log file through the same Logger instance. Creating multiple loggers would mean multiple file handles, potential write conflicts, and split logs.

---

## 2. Why does it matter in interviews?

Singleton is the **simplest pattern to explain** but the **easiest to get wrong** in an interview. Here's why interviewers ask it:

- **It tests C++ fundamentals.** Thread safety, static members, copy constructors, move semantics — Singleton touches all of these. An interviewer can gauge your C++ depth from how you implement Singleton alone.
- **It's a sub-component in larger problems.** You won't get a "design a Singleton" interview question. But inside a larger LLD problem (design a logger, design a config manager, design a cache), Singleton is expected as the way to manage the shared resource.
- **The thread-safety follow-up is a trap.** Many candidates write a naive Singleton, then the interviewer asks: "What if two threads call `getInstance()` at the same time?" If you can't answer, you fail.
- **The "why NOT Singleton" question.** Experienced interviewers ask: "Why is Singleton considered an anti-pattern by some?" If you can discuss testability, hidden dependencies, and global state problems, you stand out.

At companies like Amazon and Flipkart, Singleton comes up as part of system design discussions — "how would you ensure only one instance of the config loader exists?"

---

## 3. The problem it solves — what breaks without it

### The "before" code: accidental multiple instances

Imagine you're building a configuration manager that loads settings from a file.

```cpp
// BAD: Without Singleton
class ConfigManager {
public:
    ConfigManager() {
        // Expensive: reads config file from disk
        loadFromFile("config.json");
        std::cout << "ConfigManager created — loading config from disk\n";
    }

    std::string get(const std::string& key) { return settings_[key]; }

private:
    std::unordered_map<std::string, std::string> settings_;
    void loadFromFile(const std::string& path) { /* ... */ }
};

// In UserService.cpp
void handleUser() {
    ConfigManager config;  // Creates instance #1, reads file
    auto dbHost = config.get("db_host");
}

// In PaymentService.cpp
void handlePayment() {
    ConfigManager config;  // Creates instance #2, reads file AGAIN
    auto dbHost = config.get("db_host");
}

// In NotificationService.cpp
void handleNotification() {
    ConfigManager config;  // Creates instance #3, reads file AGAIN
    auto dbHost = config.get("db_host");
}
```

**What breaks:**
- The config file is read from disk **3 times** instead of once — wasted I/O
- If one service modifies the config in memory, other services don't see the change — inconsistency
- If the config file is updated at runtime, some services might have stale data
- No way to enforce that everyone uses the same config — new developers will create new instances

### The "after" code: Singleton

```cpp
// GOOD: With Singleton
class ConfigManager {
    ConfigManager() {
        loadFromFile("config.json");
        std::cout << "ConfigManager created — loading config from disk (once)\n";
    }
    std::unordered_map<std::string, std::string> settings_;
    void loadFromFile(const std::string& path) { /* ... */ }

public:
    ConfigManager(const ConfigManager&) = delete;
    ConfigManager& operator=(const ConfigManager&) = delete;

    static ConfigManager& getInstance() {
        static ConfigManager instance;  // Created once, thread-safe in C++11
        return instance;
    }

    std::string get(const std::string& key) { return settings_[key]; }
};

// All services use the SAME instance
void handleUser()         { auto host = ConfigManager::getInstance().get("db_host"); }
void handlePayment()      { auto host = ConfigManager::getInstance().get("db_host"); }
void handleNotification() { auto host = ConfigManager::getInstance().get("db_host"); }
// Config file loaded only ONCE. All services see the same data.
```

**What improved:**
- Config file is read **once** — no wasted I/O
- All services share the same instance — guaranteed consistency
- Can't accidentally create a second instance — constructor is private, copy is deleted
- Thread-safe initialization (C++11 guarantees this for local statics)

---

## 4. UML / Structure

```
┌───────────────────────────────────────────┐
│              Singleton                     │
│───────────────────────────────────────────│
│ - instance: static Singleton (private)     │
│ - data: ... (whatever the singleton holds) │
│───────────────────────────────────────────│
│ - Singleton()           (private ctor)     │
│ - Singleton(const&)     = delete           │
│ - operator=(const&)     = delete           │
│───────────────────────────────────────────│
│ + getInstance(): static Singleton&         │
│ + doWork(): ...                            │
│ + getData(): ...                           │
└───────────────────────────────────────────┘

        Client A ──────┐
        Client B ──────┼──> getInstance() ──> same instance
        Client C ──────┘
```

**Key elements:**
- **Private constructor** — prevents anyone from creating instances with `new` or stack allocation
- **Deleted copy constructor and assignment operator** — prevents cloning the instance
- **Static `getInstance()` method** — the only way to get the instance. Creates it on first call, returns the same one on subsequent calls.
- **Static instance** — lives for the entire lifetime of the program

---

## 5. C++ Implementation — Complete, compilable examples

### Approach 1: Meyer's Singleton (Recommended)

This is the **modern, preferred approach** in C++11 and later. It's simple, thread-safe, and leak-free.

```cpp
#include <iostream>
#include <string>
#include <unordered_map>
#include <mutex>

// ─────────────────────────────────────────────────────────
// Meyer's Singleton — uses a local static variable.
// C++11 guarantees that local static initialization is
// thread-safe. This is the simplest correct implementation.
// ─────────────────────────────────────────────────────────
class Logger {
    // Private constructor — can only be called by getInstance()
    Logger() {
        std::cout << "[Logger] Instance created.\n";
    }

    // Log level for filtering
    int minLevel_ = 0;  // 0=DEBUG, 1=INFO, 2=WARN, 3=ERROR

public:
    // Delete copy and assignment — prevent cloning
    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;

    // The ONE way to get the Logger instance
    static Logger& getInstance() {
        // This static variable is created exactly once,
        // the first time getInstance() is called.
        // Thread-safe guaranteed by C++11 standard (section 6.7).
        static Logger instance;
        return instance;
    }

    void setLevel(int level) { minLevel_ = level; }

    void log(int level, const std::string& message) {
        if (level >= minLevel_) {
            std::string prefix;
            switch (level) {
                case 0: prefix = "DEBUG"; break;
                case 1: prefix = "INFO";  break;
                case 2: prefix = "WARN";  break;
                case 3: prefix = "ERROR"; break;
                default: prefix = "???";
            }
            std::cout << "[" << prefix << "] " << message << std::endl;
        }
    }

    void debug(const std::string& msg) { log(0, msg); }
    void info(const std::string& msg)  { log(1, msg); }
    void warn(const std::string& msg)  { log(2, msg); }
    void error(const std::string& msg) { log(3, msg); }
};

// ─────────────────────────────────────────────────────────
// Usage from multiple "services" — all use the same Logger
// ─────────────────────────────────────────────────────────
void userServiceHandler() {
    Logger::getInstance().info("User login: user@example.com");
}

void paymentServiceHandler() {
    Logger::getInstance().info("Payment processed: INR 999");
    Logger::getInstance().debug("Transaction ID: TXN-12345");
}

void notificationServiceHandler() {
    Logger::getInstance().warn("SMS gateway slow, retrying...");
    Logger::getInstance().error("Push notification failed for user 42");
}

int main() {
    // Set log level to INFO (suppresses DEBUG)
    Logger::getInstance().setLevel(1);

    std::cout << "=== Application Running ===" << std::endl;

    userServiceHandler();
    paymentServiceHandler();
    notificationServiceHandler();

    // Change log level at runtime
    std::cout << "\n=== Enabling DEBUG ===" << std::endl;
    Logger::getInstance().setLevel(0);
    paymentServiceHandler();

    return 0;
}
```

**Expected output:**
```
[Logger] Instance created.
=== Application Running ===
[INFO] User login: user@example.com
[INFO] Payment processed: INR 999
[WARN] SMS gateway slow, retrying...
[ERROR] Push notification failed for user 42

=== Enabling DEBUG ===
[INFO] Payment processed: INR 999
[DEBUG] Transaction ID: TXN-12345
```

### Approach 2: Double-Checked Locking (Classic interview version)

This approach is commonly asked in interviews because it tests your understanding of thread safety and race conditions. You should know it even though Meyer's Singleton is better in practice.

```cpp
#include <mutex>
#include <string>
#include <iostream>

class ConfigManager {
    // Private static pointer — starts as null
    static ConfigManager* instance_;
    static std::mutex mutex_;

    // Private constructor
    ConfigManager() {
        std::cout << "[ConfigManager] Loading config from disk...\n";
    }

    std::string dbHost_ = "localhost";
    int dbPort_ = 5432;

public:
    ConfigManager(const ConfigManager&) = delete;
    ConfigManager& operator=(const ConfigManager&) = delete;

    static ConfigManager* getInstance() {
        // First check — no lock (fast path for subsequent calls)
        if (instance_ == nullptr) {
            // Lock — only one thread enters here
            std::lock_guard<std::mutex> lock(mutex_);
            // Second check — after acquiring lock, another thread
            // might have already created the instance
            if (instance_ == nullptr) {
                instance_ = new ConfigManager();
            }
        }
        return instance_;
    }

    std::string getDbHost() const { return dbHost_; }
    int getDbPort() const { return dbPort_; }
};

// Static member definitions (required outside class in .cpp file)
ConfigManager* ConfigManager::instance_ = nullptr;
std::mutex ConfigManager::mutex_;
```

**Why is double-checked locking needed?**
1. Without any lock: two threads can both see `instance_ == nullptr` and both create instances. Race condition.
2. With a single lock (no double check): every call to `getInstance()` acquires a lock. Slow.
3. With double-checked locking: the first check avoids the lock on subsequent calls (fast). The second check inside the lock prevents the race condition on first creation (safe).

**In modern C++ (C++11+), Meyer's Singleton is preferred** because the compiler handles thread-safe initialization for you. But interviewers still ask about double-checked locking to test your understanding.

### The DSA connection

Singleton is often used as a **container for shared data structures**:

- A Singleton `Cache` backed by a `HashMap` + `Doubly Linked List` (LRU Cache)
- A Singleton `TaskScheduler` backed by a `Priority Queue`
- A Singleton `RateLimiter` backed by a `Queue` (sliding window)

In interviews, when the problem needs a globally shared data structure, Singleton is the pattern that manages access to it.

---

## 6. When to use it — Checklist

Use Singleton when **all** of these are true:

- [ ] Exactly ONE instance should exist for the entire application lifetime
- [ ] The instance needs to be accessed from multiple places (services, modules, threads)
- [ ] Creating multiple instances would cause bugs (e.g., multiple connection pools exhausting the DB)
- [ ] The instance manages a shared resource (log file, config, cache, connection pool)

**Do NOT use Singleton when:**
- You just want "convenient" global access — use dependency injection instead
- You need to test the class in isolation — Singletons make mocking difficult
- You might need multiple instances in the future (e.g., multiple caches for different domains)
- The "shared state" is really just a constant — use a `const` or `constexpr` instead

---

## 7. Common mistakes in interviews

| Mistake | Why it's wrong | What to do instead |
|---|---|---|
| **Not making the constructor private** | If the constructor is public, anyone can create additional instances, defeating the entire pattern. | Always make the constructor private. |
| **Forgetting to delete copy/assignment** | `ConfigManager c2 = ConfigManager::getInstance()` would create a copy — now you have two instances. | Always `= delete` the copy constructor and assignment operator. |
| **Naive thread-unsafe implementation** | Writing `if (instance == null) instance = new Singleton()` without any synchronization. Two threads can both pass the check simultaneously. | Use Meyer's Singleton (local static) or double-checked locking with a mutex. |
| **Memory leak with `new`** | Using `new` without `delete` in the double-checked locking approach means the Singleton is never destroyed. | Use Meyer's Singleton (automatic cleanup) or add an explicit `destroy()` method. |
| **Overusing Singleton** | Making everything a Singleton because "there should be only one" — UserService, OrderService, PaymentService as Singletons. This creates hidden global state everywhere. | Only use Singleton for truly shared resources (Logger, Config, Cache). For services, use dependency injection. |
| **Not knowing when it's an anti-pattern** | Interviewers often ask "what's wrong with Singleton?" If you can't answer, it shows you've memorized the pattern without understanding it. | Know the downsides: hard to test (can't mock), hidden dependencies, global state, violates Single Responsibility (manages its own lifecycle + does its job). |

---

## 8. Related patterns

| Pattern | Relationship |
|---|---|
| **State** | State objects (like IdleState, HasCoinState) are often stateless — they only define behavior. In that case, each State can be a Singleton to avoid creating new objects on every transition. |
| **Factory** | A Factory method is sometimes implemented as a Singleton. The Factory itself needs only one instance, and it creates other objects. |
| **Strategy** | Stateless Strategy objects can be Singletons. If a RankByRewards strategy has no internal state, one shared instance is sufficient. |
| **Observer** | An event bus or notification manager is often a Singleton — one central hub that all subjects publish to and all observers subscribe to. |

---

## 9. Practice problems in this repo

Singleton is not the primary pattern in any problem in this repo (because it's too simple for a standalone problem), but it appears as a supporting pattern in several:

| Problem | How Singleton applies |
|---|---|
| [011 - API Rate Limiter](../problems/tier1-foundation/011-rate-limiter/) | The rate limiter instance is typically a Singleton — one shared limiter across all API endpoints |
| [003 - Notification System](../problems/tier1-foundation/003-notification-system/) | The event bus / notification manager can be implemented as a Singleton |

In interviews, Singleton is most commonly tested as part of a larger system design — "How would you ensure there's only one instance of the cache/logger/config?" The answer is always Singleton.

---

## 10. When NOT to use it — The anti-pattern discussion

This section exists because **interviewers will ask you about Singleton's downsides**. Knowing when NOT to use a pattern is just as important as knowing when to use it.

**Why some developers consider Singleton an anti-pattern:**

1. **Hidden dependencies.** When a function calls `Logger::getInstance()` internally, the caller has no idea that function depends on a Logger. With dependency injection, the dependency is explicit in the function signature.

2. **Hard to test.** You can't easily mock a Singleton in unit tests. If `PaymentService` uses `ConfigManager::getInstance()`, you can't substitute a test config without modifying the Singleton itself.

3. **Global state.** A Singleton is essentially a dressed-up global variable. Global state makes code harder to reason about, especially in multi-threaded applications.

4. **Violates Single Responsibility.** The class manages both its own lifecycle (creation, uniqueness) AND its actual job (logging, config management). These are two separate responsibilities.

**The balanced view for interviews:** Singleton is appropriate for a small number of truly shared resources (Logger, Config, Connection Pool). For everything else, prefer dependency injection. If the interviewer asks, acknowledge both sides — that shows design maturity.

---

## Further reading

- [Refactoring Guru — Singleton](https://refactoring.guru/design-patterns/singleton)
- [GFG — Singleton Pattern](https://www.geeksforgeeks.org/singleton-design-pattern/)
