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

// ─── Assignment Interface ───────────────────────────────────────────────────
// HINT: This interface lets you swap assignment logic at runtime.
// What method signature would let you select an agent for an issue?

class /* YourInterfaceName */ {
public:
    virtual int /* yourMethodName */(vector<Agent>& agents, const Issue& issue) = 0;
    virtual ~/* YourInterfaceName */() = default;
};

// ─── Concrete Strategy ──────────────────────────────────────────────────────
// TODO: Implement a round-robin strategy:
//   - Track which agent was assigned last
//   - Cycle through agents in order (0, 1, 2, 0, 1, 2, ...)
//   - Return the selected agent's ID


// ─── Resolver ───────────────────────────────────────────────────────────────
// TODO: Implement an IssueResolver class that:
//   - Accepts any assignment strategy (via constructor or setter)
//   - Has an assign() method that assigns an issue to the selected agent
//   - Has a getAgentIssues() method to retrieve issues for a given agent
//   - Does NOT know about specific assignment algorithms

// class IssueResolver {
// public:
//     IssueResolver(/* what goes here? */);
//     Issue assign(vector<Agent>& agents, vector<Issue>& issues, Issue issue);
//     vector<Issue> getAgentIssues(const vector<Issue>& issues, int agentId);
// };


// ─── Test Entry Points (must exist for tests to compile) ────────────────────
// Your solution must provide these functions:
//
//   Issue assign_issue(vector<Agent>& agents, vector<Issue>& issues, Issue issue);
//   vector<Issue> get_agent_issues(const vector<Issue>& issues, int agentId);
//
// How you implement them internally is up to you.
// ─────────────────────────────────────────────────────────────────────────────

