#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

// ─── Data Model (given — do not modify) ─────────────────────────────────────

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

// ─── NEW in Extension 2 ─────────────────────────────────────────────────────
//
// The product team now requires:
//   1. State machine: OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED
//      Invalid transitions must be rejected (return false).
//   2. Notifications: When state changes, all registered observers are notified.
//   3. Priority queue: assign_next_priority() picks the highest-priority
//      unassigned issue first. Tiebreak by lowest issue ID.
//
// Think about:
//   - How do you decouple notifications from the state machine?
//   - What interface lets you add new observers without modifying the resolver?
//   - How do you efficiently find the highest-priority unassigned issue?
//
// Entry points (must exist for tests):
//   Issue assign_issue(vector<Agent>&, vector<Issue>&, Issue);
//   vector<Issue> get_agent_issues(const vector<Issue>&, int);
//   Issue assign_least_loaded(vector<Agent>&, vector<Issue>&, Issue);
//   Issue assign_by_specialist(vector<Agent>&, vector<Issue>&, Issue);
//   bool transition_issue(vector<Issue>&, int, IssueState, vector<string>&);
//   Issue assign_next_priority(vector<Agent>&, vector<Issue>&);
//
// ─────────────────────────────────────────────────────────────────────────────


