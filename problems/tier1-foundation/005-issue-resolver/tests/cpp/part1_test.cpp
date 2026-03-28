// Part 1 Tests — Customer Issue Resolution System
// Tests round-robin agent assignment and issue retrieval

#include "solution.cpp"
#include <cassert>
#include <iostream>
using namespace std;

int part1_tests() {
    int passed = 0;
    int failed = 0;

    // Test 1: round-robin assigns to agents in order
    try {
        vector<Agent> agents = {
            {0, "Alice", 0, {}},
            {1, "Bob",   0, {}},
            {2, "Carol", 0, {}},
        };
        vector<Issue> issues;

        auto i1 = assign_issue(agents, issues, {1, "Issue A", Category::GENERAL, Priority::LOW, IssueState::OPEN, -1});
        auto i2 = assign_issue(agents, issues, {2, "Issue B", Category::GENERAL, Priority::LOW, IssueState::OPEN, -1});
        auto i3 = assign_issue(agents, issues, {3, "Issue C", Category::GENERAL, Priority::LOW, IssueState::OPEN, -1});

        assert(i1.assignedAgentId == 0); // first agent
        assert(i2.assignedAgentId == 1); // second agent
        assert(i3.assignedAgentId == 2); // third agent
        cout << "PASS test_round_robin_assignment" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_round_robin_assignment" << endl;
        failed++;
    }

    // Test 2: round-robin wraps around
    try {
        vector<Agent> agents = {
            {0, "Alice", 0, {}},
            {1, "Bob",   0, {}},
        };
        vector<Issue> issues;

        // Reset global round-robin by creating fresh resolver
        RoundRobinStrategy rr;
        IssueResolver resolver(&rr);

        auto i1 = resolver.assign(agents, issues, {10, "A", Category::GENERAL, Priority::LOW, IssueState::OPEN, -1});
        auto i2 = resolver.assign(agents, issues, {11, "B", Category::GENERAL, Priority::LOW, IssueState::OPEN, -1});
        auto i3 = resolver.assign(agents, issues, {12, "C", Category::GENERAL, Priority::LOW, IssueState::OPEN, -1});

        assert(i1.assignedAgentId == 0);
        assert(i2.assignedAgentId == 1);
        assert(i3.assignedAgentId == 0); // wraps back to first
        cout << "PASS test_round_robin_wrap" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_round_robin_wrap" << endl;
        failed++;
    }

    // Test 3: get_agent_issues returns correct issues
    try {
        vector<Agent> agents = {
            {0, "Alice", 0, {}},
            {1, "Bob",   0, {}},
        };
        vector<Issue> issues;
        RoundRobinStrategy rr;
        IssueResolver resolver(&rr);

        resolver.assign(agents, issues, {20, "X", Category::BILLING, Priority::HIGH, IssueState::OPEN, -1});
        resolver.assign(agents, issues, {21, "Y", Category::TECHNICAL, Priority::LOW, IssueState::OPEN, -1});
        resolver.assign(agents, issues, {22, "Z", Category::GENERAL, Priority::MEDIUM, IssueState::OPEN, -1});

        auto aliceIssues = resolver.getAgentIssues(issues, 0);
        auto bobIssues = resolver.getAgentIssues(issues, 1);

        assert(aliceIssues.size() == 2); // issues 20, 22
        assert(bobIssues.size() == 1);   // issue 21
        assert(aliceIssues[0].id == 20);
        assert(aliceIssues[1].id == 22);
        assert(bobIssues[0].id == 21);
        cout << "PASS test_get_agent_issues" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_get_agent_issues" << endl;
        failed++;
    }

    // Test 4: agent currentLoad increments on assignment
    try {
        vector<Agent> agents = {
            {0, "Alice", 0, {}},
            {1, "Bob",   0, {}},
        };
        vector<Issue> issues;
        RoundRobinStrategy rr;
        IssueResolver resolver(&rr);

        resolver.assign(agents, issues, {30, "A", Category::GENERAL, Priority::LOW, IssueState::OPEN, -1});
        resolver.assign(agents, issues, {31, "B", Category::GENERAL, Priority::LOW, IssueState::OPEN, -1});
        resolver.assign(agents, issues, {32, "C", Category::GENERAL, Priority::LOW, IssueState::OPEN, -1});

        assert(agents[0].currentLoad == 2); // got issues 30, 32
        assert(agents[1].currentLoad == 1); // got issue 31
        cout << "PASS test_agent_load_increment" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_agent_load_increment" << endl;
        failed++;
    }

    // Test 5: empty issues returns empty for get_agent_issues
    try {
        vector<Issue> issues;
        RoundRobinStrategy rr;
        IssueResolver resolver(&rr);

        auto result = resolver.getAgentIssues(issues, 0);
        assert(result.empty());
        cout << "PASS test_empty_issues" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_empty_issues" << endl;
        failed++;
    }

    cout << "PART1_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
