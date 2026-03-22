# Singleton Pattern

## The one-line explanation

Ensure a class has only one instance, and provide a global point of access to it.

---

## When to use it

Use Singleton when:
- Exactly one object is needed to coordinate actions across the system
- You need a single shared resource: config manager, logger, connection pool, cache
- Global access is genuinely needed (not just convenient)

---

## The structure

```
Singleton
    ├── private constructor (prevents external instantiation)
    ├── private static instance
    └── public static getInstance() → returns the single instance
```

---

## C++ Example (thread-safe, C++11+)

```cpp
#include <mutex>
#include <string>

class ConfigManager {
    static ConfigManager* instance;
    static std::mutex mtx;

    std::string dbHost;
    int port;

    // Private constructor
    ConfigManager() : dbHost("localhost"), port(5432) {}

public:
    // Delete copy constructor and assignment
    ConfigManager(const ConfigManager&) = delete;
    ConfigManager& operator=(const ConfigManager&) = delete;

    static ConfigManager* getInstance() {
        std::lock_guard<std::mutex> lock(mtx);
        if (instance == nullptr) {
            instance = new ConfigManager();
        }
        return instance;
    }

    std::string getDbHost() const { return dbHost; }
    int getPort() const { return port; }
};

// Static member definitions
ConfigManager* ConfigManager::instance = nullptr;
std::mutex ConfigManager::mtx;
```

**Modern C++11 approach (Meyer's Singleton — simpler and thread-safe by default):**

```cpp
class Logger {
    Logger() = default;
public:
    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;

    static Logger& getInstance() {
        static Logger instance;  // initialized once, thread-safe in C++11
        return instance;
    }

    void log(const std::string& msg) {
        // write to file/console
    }
};
```

---

## Real-world analogies

- **Database connection pool**: One pool shared across the entire app
- **Application logger**: All modules write to the same log file
- **Government**: One president/PM at a time for a given country

---

## The DSA connection

Singleton is often used as a container for shared data structures. A singleton `Cache` backed by a `HashMap`, or a singleton `PriorityQueue` for global job scheduling.

---

## Common mistakes

1. **Global state abuse** — Singleton is global state. Overuse makes testing hard (can't mock it)
2. **Not thread-safe** — naive implementation (check → create) has a race condition; use locks or Meyer's Singleton
3. **Singleton as service locator** — anti-pattern; prefer dependency injection

---

## When NOT to use it

- If you just want convenient global access — use dependency injection instead
- If you're writing unit tests — singletons make mocking hard
- If you might need multiple instances later — don't paint yourself into a corner

---

## Further reading

- [Refactoring Guru — Singleton](https://refactoring.guru/design-patterns/singleton)
- [GFG — Singleton Pattern](https://www.geeksforgeeks.org/singleton-design-pattern/)
