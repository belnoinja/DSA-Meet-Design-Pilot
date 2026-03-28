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

// ─── Your Design Starts Here ────────────────────────────────────────────────
//
// Design and implement an IssueResolver that:
//   1. Assigns issues to agents using round-robin rotation
//   2. Allows new assignment strategies to be added WITHOUT modifying
//      the resolver itself
//
// Think about:
//   - What abstraction lets you swap assignment logic at runtime?
//   - How would you add a 4th assignment policy with zero changes
//     to existing code?
//   - What happens when Extension 1 (multiple strategies) is added?
//
// Entry points (must exist for tests):
//   Issue assign_issue(vector<Agent>& agents, vector<Issue>& issues, Issue issue);
//   vector<Issue> get_agent_issues(const vector<Issue>& issues, int agentId);
//
// ─────────────────────────────────────────────────────────────────────────────


