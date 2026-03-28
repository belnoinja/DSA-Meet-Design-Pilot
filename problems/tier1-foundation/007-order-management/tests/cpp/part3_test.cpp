// Part 3 Tests — Transition History + Observer
// Tests history tracking and observer notifications

#include <cassert>
#include <iostream>
using namespace std;

// Test observer that records notifications
class TestObserver : public OrderObserver {
public:
    vector<tuple<string, OrderState, OrderState>> notifications;

    void onStateChange(const string& orderId,
                       OrderState from, OrderState to) override {
        notifications.push_back({orderId, from, to});
    }
};

int part3_tests() {
    int passed = 0;
    int failed = 0;

    // Test 1: history tracks full lifecycle
    try {
        reset_manager();
        auto id = create_order({{"PROD-1", 1}}, 100.0);
        confirm_order(id);
        ship_order(id);
        deliver_order(id);
        auto hist = get_order_history(id);
        // Should have: creation entry + 3 transitions = 4 entries
        assert(hist.size() == 4);
        assert(hist[1].fromState == OrderState::Created);
        assert(hist[1].toState == OrderState::Confirmed);
        assert(hist[2].fromState == OrderState::Confirmed);
        assert(hist[2].toState == OrderState::Shipped);
        assert(hist[3].fromState == OrderState::Shipped);
        assert(hist[3].toState == OrderState::Delivered);
        cout << "PASS test_history_full_lifecycle" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_history_full_lifecycle" << endl;
        failed++;
    }

    // Test 2: history timestamps are non-decreasing
    try {
        reset_manager();
        auto id = create_order({{"PROD-1", 1}}, 100.0);
        confirm_order(id);
        ship_order(id);
        auto hist = get_order_history(id);
        for (size_t i = 1; i < hist.size(); i++) {
            assert(hist[i].timestamp >= hist[i-1].timestamp);
        }
        cout << "PASS test_history_timestamps_ordered" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_history_timestamps_ordered" << endl;
        failed++;
    }

    // Test 3: failed transitions do not appear in history
    try {
        reset_manager();
        auto id = create_order({{"PROD-1", 1}}, 100.0);
        ship_order(id); // invalid — should fail
        auto hist = get_order_history(id);
        assert(hist.size() == 1); // only the creation entry
        cout << "PASS test_failed_transition_no_history" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_failed_transition_no_history" << endl;
        failed++;
    }

    // Test 4: observer is notified on valid transitions
    try {
        reset_manager();
        TestObserver obs;
        add_observer(&obs);
        auto id = create_order({{"PROD-1", 1}}, 100.0);
        confirm_order(id);
        ship_order(id);
        assert(obs.notifications.size() == 2);
        assert(get<1>(obs.notifications[0]) == OrderState::Created);
        assert(get<2>(obs.notifications[0]) == OrderState::Confirmed);
        assert(get<1>(obs.notifications[1]) == OrderState::Confirmed);
        assert(get<2>(obs.notifications[1]) == OrderState::Shipped);
        cout << "PASS test_observer_notified" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_observer_notified" << endl;
        failed++;
    }

    // Test 5: observer NOT notified on failed transitions
    try {
        reset_manager();
        TestObserver obs;
        add_observer(&obs);
        auto id = create_order({{"PROD-1", 1}}, 100.0);
        ship_order(id); // invalid
        assert(obs.notifications.size() == 0);
        cout << "PASS test_observer_not_notified_on_failure" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_observer_not_notified_on_failure" << endl;
        failed++;
    }

    // Test 6: cancellation appears in history
    try {
        reset_manager();
        set_inventory("PROD-1", 10);
        auto id = create_order({{"PROD-1", 1}}, 100.0);
        cancel_order(id);
        auto hist = get_order_history(id);
        assert(hist.size() == 2); // creation + cancellation
        assert(hist[1].fromState == OrderState::Created);
        assert(hist[1].toState == OrderState::Cancelled);
        cout << "PASS test_cancel_in_history" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_cancel_in_history" << endl;
        failed++;
    }

    cout << "PART3_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
