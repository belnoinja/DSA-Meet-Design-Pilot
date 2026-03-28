// Part 3 Tests — Issue State Tracking + Priority
// Tests state transitions, observer notifications, and priority queue

#include <cassert>
#include <iostream>
using namespace std;

int part3_tests() {
    int passed = 0;
    int failed = 0;

    // Test 1: valid state transition OPEN -> IN_PROGRESS
    try {
        vector<Issue> issues = {
            {200, "Bug", Category::TECHNICAL, Priority::HIGH, IssueState::OPEN, 0},
        };
        vector<string> notifications;
        bool ok = transition_issue(issues, 200, IssueState::IN_PROGRESS, notifications);
        assert(ok == true);
        assert(issues[0].state == IssueState::IN_PROGRESS);
        assert(notifications.size() == 1);
        assert(notifications[0] == "Issue 200: OPEN -> IN_PROGRESS");
        cout << "PASS test_valid_transition_open_to_inprogress" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_valid_transition_open_to_inprogress" << endl;
        failed++;
    }

    // Test 2: invalid state transition OPEN -> CLOSED is rejected
    try {
        vector<Issue> issues = {
            {201, "Bug", Category::TECHNICAL, Priority::HIGH, IssueState::OPEN, 0},
        };
        vector<string> notifications;
        bool ok = transition_issue(issues, 201, IssueState::CLOSED, notifications);
        assert(ok == false);
        assert(issues[0].state == IssueState::OPEN); // state unchanged
        assert(notifications.empty()); // no notification
        cout << "PASS test_invalid_transition_rejected" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_invalid_transition_rejected" << endl;
        failed++;
    }

    // Test 3: full lifecycle OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED
    try {
        vector<Issue> issues = {
            {202, "Payment fail", Category::BILLING, Priority::CRITICAL, IssueState::OPEN, 1},
        };
        vector<string> notifications;
        assert(transition_issue(issues, 202, IssueState::IN_PROGRESS, notifications));
        assert(transition_issue(issues, 202, IssueState::RESOLVED, notifications));
        assert(transition_issue(issues, 202, IssueState::CLOSED, notifications));
        assert(issues[0].state == IssueState::CLOSED);
        assert(notifications.size() == 3);
        cout << "PASS test_full_lifecycle" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_full_lifecycle" << endl;
        failed++;
    }

    // Test 4: assign_next_priority picks highest priority first
    try {
        vector<Agent> agents = {
            {0, "Alice", 0, {}},
            {1, "Bob",   0, {}},
        };
        vector<Issue> issues = {
            {300, "Low prio",  Category::GENERAL, Priority::LOW,      IssueState::OPEN, -1},
            {301, "Critical",  Category::BILLING, Priority::CRITICAL, IssueState::OPEN, -1},
            {302, "Medium",    Category::TECHNICAL, Priority::MEDIUM, IssueState::OPEN, -1},
        };

        auto first = assign_next_priority(agents, issues);
        assert(first.id == 301); // CRITICAL picked first
        assert(first.assignedAgentId != -1);
        cout << "PASS test_priority_highest_first" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_priority_highest_first" << endl;
        failed++;
    }

    // Test 5: priority tie broken by lowest issue ID
    try {
        vector<Agent> agents = {
            {0, "Alice", 0, {}},
        };
        vector<Issue> issues = {
            {403, "Third",  Category::GENERAL, Priority::HIGH, IssueState::OPEN, -1},
            {401, "First",  Category::GENERAL, Priority::HIGH, IssueState::OPEN, -1},
            {402, "Second", Category::GENERAL, Priority::HIGH, IssueState::OPEN, -1},
        };

        auto first = assign_next_priority(agents, issues);
        assert(first.id == 401); // lowest ID among HIGH priority
        cout << "PASS test_priority_tiebreak_by_id" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_priority_tiebreak_by_id" << endl;
        failed++;
    }

    // Test 6: assign_next_priority skips already-assigned issues
    try {
        vector<Agent> agents = {
            {0, "Alice", 0, {}},
        };
        vector<Issue> issues = {
            {500, "Assigned",   Category::GENERAL, Priority::CRITICAL, IssueState::OPEN, 1},  // already assigned
            {501, "Unassigned", Category::GENERAL, Priority::LOW,      IssueState::OPEN, -1}, // unassigned
        };

        auto result = assign_next_priority(agents, issues);
        assert(result.id == 501); // skips 500 (already assigned)
        cout << "PASS test_priority_skips_assigned" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_priority_skips_assigned" << endl;
        failed++;
    }

    cout << "PART3_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
