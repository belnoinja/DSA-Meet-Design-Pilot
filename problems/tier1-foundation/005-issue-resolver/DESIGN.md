# Design Walkthrough — Customer Issue Resolution System

> This file is the answer guide. Only read after you've attempted the problem.

---

## The Core Design Decision

The problem has **two moving parts**:
1. The **assignment algorithm** — how we pick which agent gets an issue
2. The **notification mechanism** — who gets told when an issue changes state

The Strategy pattern isolates the assignment algorithm. The Observer pattern decouples state-change notifications from the issue itself.

```
IssueResolver (stable)
    └── AssignmentStrategy (interface — stable)
            ├── RoundRobinStrategy    ← changes independently
            ├── LeastLoadedStrategy   ← changes independently
            └── SpecialistStrategy    ← changes independently

Issue state machine
    └── IssueObserver (interface — stable)
            ├── LoggingObserver       ← changes independently
            └── (future observers)    ← changes independently
```

Adding a 4th assignment strategy doesn't touch IssueResolver. Adding a new observer doesn't touch the state machine. **This is Open/Closed Principle in action.**

---

## Reference Implementation

```cpp
#include <vector>
#include <algorithm>
#include <string>
#include <queue>
#include <unordered_map>
#include <functional>
using namespace std;

// ─── Data Structures ────────────────────────────────────────────────────────

enum class Priority { LOW, MEDIUM, HIGH, CRITICAL };
enum class IssueState { OPEN, IN_PROGRESS, RESOLVED, CLOSED };
enum class Category { BILLING, TECHNICAL, GENERAL, ACCOUNT };

struct Issue {
    int id;
    string description;
    Category category;
    Priority priority;
    IssueState state;
    int assignedAgentId;
};

struct Agent {
    int id;
    string name;
    int currentLoad;
    vector<Category> specializations;
};

// ─── Strategy Interface ─────────────────────────────────────────────────────

class AssignmentStrategy {
public:
    virtual int selectAgent(vector<Agent>& agents, const Issue& issue) = 0;
    virtual ~AssignmentStrategy() = default;
};

// ─── Concrete Strategies ────────────────────────────────────────────────────

class RoundRobinStrategy : public AssignmentStrategy {
    int nextIndex = 0;
public:
    int selectAgent(vector<Agent>& agents, const Issue& issue) override {
        if (agents.empty()) return -1;
        int idx = nextIndex % agents.size();
        nextIndex = (nextIndex + 1) % agents.size();
        return agents[idx].id;
    }
};

class LeastLoadedStrategy : public AssignmentStrategy {
public:
    int selectAgent(vector<Agent>& agents, const Issue& issue) override {
        if (agents.empty()) return -1;
        int bestIdx = 0;
        for (int i = 1; i < (int)agents.size(); i++) {
            if (agents[i].currentLoad < agents[bestIdx].currentLoad) {
                bestIdx = i;
            } else if (agents[i].currentLoad == agents[bestIdx].currentLoad
                       && agents[i].id < agents[bestIdx].id) {
                bestIdx = i;
            }
        }
        return agents[bestIdx].id;
    }
};

class SpecialistStrategy : public AssignmentStrategy {
    LeastLoadedStrategy fallback;
public:
    int selectAgent(vector<Agent>& agents, const Issue& issue) override {
        if (agents.empty()) return -1;
        int bestIdx = -1;
        for (int i = 0; i < (int)agents.size(); i++) {
            bool isSpecialist = false;
            for (auto& cat : agents[i].specializations) {
                if (cat == issue.category) { isSpecialist = true; break; }
            }
            if (!isSpecialist) continue;
            if (bestIdx == -1
                || agents[i].currentLoad < agents[bestIdx].currentLoad
                || (agents[i].currentLoad == agents[bestIdx].currentLoad
                    && agents[i].id < agents[bestIdx].id)) {
                bestIdx = i;
            }
        }
        if (bestIdx == -1) return fallback.selectAgent(agents, issue);
        return agents[bestIdx].id;
    }
};

// ─── Observer Interface ─────────────────────────────────────────────────────

class IssueObserver {
public:
    virtual void onStateChange(int issueId, IssueState oldState, IssueState newState) = 0;
    virtual ~IssueObserver() = default;
};

class LoggingObserver : public IssueObserver {
    vector<string>& log;
public:
    LoggingObserver(vector<string>& logRef) : log(logRef) {}
    void onStateChange(int issueId, IssueState oldState, IssueState newState) override {
        auto stateName = [](IssueState s) -> string {
            switch (s) {
                case IssueState::OPEN: return "OPEN";
                case IssueState::IN_PROGRESS: return "IN_PROGRESS";
                case IssueState::RESOLVED: return "RESOLVED";
                case IssueState::CLOSED: return "CLOSED";
            }
            return "UNKNOWN";
        };
        log.push_back("Issue " + to_string(issueId) + ": "
                       + stateName(oldState) + " -> " + stateName(newState));
    }
};

// ─── IssueResolver ──────────────────────────────────────────────────────────

class IssueResolver {
    AssignmentStrategy* strategy;
    vector<IssueObserver*> observers;
public:
    IssueResolver(AssignmentStrategy* s) : strategy(s) {}
    void setStrategy(AssignmentStrategy* s) { strategy = s; }
    void addObserver(IssueObserver* obs) { observers.push_back(obs); }

    Issue assign(vector<Agent>& agents, vector<Issue>& issues, Issue issue) {
        int agentId = strategy->selectAgent(agents, issue);
        issue.assignedAgentId = agentId;
        issue.state = IssueState::OPEN;
        for (auto& agent : agents) {
            if (agent.id == agentId) { agent.currentLoad++; break; }
        }
        issues.push_back(issue);
        return issue;
    }

    vector<Issue> getAgentIssues(const vector<Issue>& issues, int agentId) {
        vector<Issue> result;
        for (auto& issue : issues) {
            if (issue.assignedAgentId == agentId) result.push_back(issue);
        }
        return result;
    }

    bool transitionState(vector<Issue>& issues, int issueId, IssueState newState) {
        for (auto& issue : issues) {
            if (issue.id != issueId) continue;
            IssueState old = issue.state;
            bool valid = false;
            if (old == IssueState::OPEN && newState == IssueState::IN_PROGRESS) valid = true;
            if (old == IssueState::IN_PROGRESS && newState == IssueState::RESOLVED) valid = true;
            if (old == IssueState::RESOLVED && newState == IssueState::CLOSED) valid = true;
            if (!valid) return false;
            issue.state = newState;
            for (auto* obs : observers) {
                obs->onStateChange(issueId, old, newState);
            }
            return true;
        }
        return false;
    }

    Issue assignNextPriority(vector<Agent>& agents, vector<Issue>& issues) {
        // Find highest priority unassigned issue
        int bestIdx = -1;
        for (int i = 0; i < (int)issues.size(); i++) {
            if (issues[i].assignedAgentId != -1) continue;
            if (issues[i].state != IssueState::OPEN) continue;
            if (bestIdx == -1) { bestIdx = i; continue; }
            if ((int)issues[i].priority > (int)issues[bestIdx].priority) {
                bestIdx = i;
            } else if (issues[i].priority == issues[bestIdx].priority
                       && issues[i].id < issues[bestIdx].id) {
                bestIdx = i;
            }
        }
        if (bestIdx == -1) return {-1, "", Category::GENERAL, Priority::LOW, IssueState::OPEN, -1};
        Issue issue = issues[bestIdx];
        issues.erase(issues.begin() + bestIdx);
        return assign(agents, issues, issue);
    }
};
```

---

## Extension 1: Multiple Strategies

The key insight is that `LeastLoadedStrategy` and `SpecialistStrategy` are just new implementations of `AssignmentStrategy`. The resolver never changes — only the strategy plugged into it.

`SpecialistStrategy` demonstrates composition: it delegates to `LeastLoadedStrategy` as a fallback when no specialist is found.

---

## Extension 2: Observer + Priority Queue

The Observer pattern decouples state-change notifications:
- `IssueObserver` is the interface
- `LoggingObserver` is one concrete observer that writes to a notification log
- The resolver holds a list of observers and notifies all of them on state transitions

The priority queue for `assign_next_priority()` selects the highest-priority unassigned issue. Priority enum values are ordered so that casting to `int` gives the correct comparison (CRITICAL > HIGH > MEDIUM > LOW).

---

## What interviewers look for

1. **Did you name the patterns?** Say "Strategy pattern for assignment" and "Observer pattern for notifications" out loud.
2. **Did you separate interface from implementation?** `AssignmentStrategy` is the contract; concrete strategies fulfill it.
3. **Is your resolver closed for modification?** Adding a new strategy shouldn't touch `IssueResolver`.
4. **State machine correctness:** Only valid transitions are allowed. Invalid transitions return false without side effects.
5. **Priority handling:** CRITICAL issues are processed before LOW. Ties are broken deterministically.

---

## Common interview follow-ups

- *"What if you wanted to persist assignment history?"* -> Store assignment events in a log; replay to reconstruct state
- *"What if agents go offline?"* -> Filter unavailable agents in the strategy; add an availability flag to Agent
- *"How would you handle escalation?"* -> Add an EscalationObserver that triggers when an issue stays IN_PROGRESS too long
- *"What if you need to reassign an issue?"* -> Decrement old agent's load, increment new agent's load; fire observer notification
