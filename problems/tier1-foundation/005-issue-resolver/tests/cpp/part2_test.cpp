// Part 2 Tests — Multiple Assignment Strategies
// Tests least-loaded and category-specialist assignment strategies

#include <cassert>
#include <iostream>
using namespace std;

// Note: solution.cpp is included via the harness (not directly here)
// These tests assume assign_least_loaded() and assign_by_specialist() are available

int part2_tests() {
    int passed = 0;
    int failed = 0;

    // Test 1: least-loaded assigns to agent with fewest issues
    try {
        vector<Agent> agents = {
            {0, "Alice", 3, {}},
            {1, "Bob",   1, {}},
            {2, "Carol", 2, {}},
        };
        vector<Issue> issues;

        auto result = assign_least_loaded(agents, issues,
            {100, "Help", Category::GENERAL, Priority::LOW, IssueState::OPEN, -1});
        assert(result.assignedAgentId == 1); // Bob has lowest load (1)
        cout << "PASS test_least_loaded_basic" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_least_loaded_basic" << endl;
        failed++;
    }

    // Test 2: least-loaded breaks ties by lowest agent ID
    try {
        vector<Agent> agents = {
            {0, "Alice", 2, {}},
            {1, "Bob",   2, {}},
            {2, "Carol", 2, {}},
        };
        vector<Issue> issues;

        auto result = assign_least_loaded(agents, issues,
            {101, "Tie", Category::GENERAL, Priority::LOW, IssueState::OPEN, -1});
        assert(result.assignedAgentId == 0); // Alice wins tie (lowest ID)
        cout << "PASS test_least_loaded_tiebreak" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_least_loaded_tiebreak" << endl;
        failed++;
    }

    // Test 3: specialist assigns to agent with matching category
    try {
        vector<Agent> agents = {
            {0, "Alice", 0, {Category::BILLING}},
            {1, "Bob",   0, {Category::TECHNICAL}},
            {2, "Carol", 0, {Category::GENERAL}},
        };
        vector<Issue> issues;

        auto result = assign_by_specialist(agents, issues,
            {102, "Tech issue", Category::TECHNICAL, Priority::HIGH, IssueState::OPEN, -1});
        assert(result.assignedAgentId == 1); // Bob specializes in TECHNICAL
        cout << "PASS test_specialist_match" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_specialist_match" << endl;
        failed++;
    }

    // Test 4: specialist falls back to least-loaded when no specialist exists
    try {
        vector<Agent> agents = {
            {0, "Alice", 3, {Category::BILLING}},
            {1, "Bob",   1, {Category::BILLING}},
            {2, "Carol", 2, {Category::BILLING}},
        };
        vector<Issue> issues;

        auto result = assign_by_specialist(agents, issues,
            {103, "Account issue", Category::ACCOUNT, Priority::MEDIUM, IssueState::OPEN, -1});
        // No ACCOUNT specialist — falls back to least-loaded: Bob (load=1)
        assert(result.assignedAgentId == 1);
        cout << "PASS test_specialist_fallback" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_specialist_fallback" << endl;
        failed++;
    }

    // Test 5: specialist picks least-loaded among multiple specialists
    try {
        vector<Agent> agents = {
            {0, "Alice", 5, {Category::BILLING, Category::TECHNICAL}},
            {1, "Bob",   2, {Category::TECHNICAL}},
            {2, "Carol", 8, {Category::TECHNICAL, Category::GENERAL}},
        };
        vector<Issue> issues;

        auto result = assign_by_specialist(agents, issues,
            {104, "Server down", Category::TECHNICAL, Priority::CRITICAL, IssueState::OPEN, -1});
        assert(result.assignedAgentId == 1); // Bob is least-loaded TECHNICAL specialist
        cout << "PASS test_specialist_least_loaded" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_specialist_least_loaded" << endl;
        failed++;
    }

    cout << "PART2_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
