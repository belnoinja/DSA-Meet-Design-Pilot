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

// ─── NEW in Extension 1 ─────────────────────────────────────────────────────
//
// The ops team now wants PLUGGABLE assignment strategies:
// round-robin, least-loaded, and category-specialist.
//
// Think about:
//   - How do you add new assignment algorithms without modifying the resolver?
//   - What if the specialist strategy needs a fallback?
//   - Can you swap strategies at runtime?
//
// Entry points (must exist for tests):
//   Issue assign_issue(vector<Agent>&, vector<Issue>&, Issue);
//   vector<Issue> get_agent_issues(const vector<Issue>&, int);
//   Issue assign_least_loaded(vector<Agent>&, vector<Issue>&, Issue);
//   Issue assign_by_specialist(vector<Agent>&, vector<Issue>&, Issue);
//
// ─────────────────────────────────────────────────────────────────────────────


