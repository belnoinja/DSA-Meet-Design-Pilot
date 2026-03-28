// Part 1 Tests — Order Management System
// Tests basic order lifecycle and state transitions

#include "solution.cpp"
#include <cassert>
#include <iostream>
using namespace std;

int part1_tests() {
    int passed = 0;
    int failed = 0;

    // Test 1: create order returns valid ID and state is Created
    try {
        reset_manager();
        auto id = create_order({{"PROD-1", 2}}, 500.0);
        assert(!id.empty());
        assert(get_order_state(id) == OrderState::Created);
        cout << "PASS test_create_order" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_create_order" << endl;
        failed++;
    }

    // Test 2: full valid lifecycle Created -> Confirmed -> Shipped -> Delivered
    try {
        reset_manager();
        auto id = create_order({{"PROD-1", 1}}, 100.0);
        assert(confirm_order(id) == true);
        assert(get_order_state(id) == OrderState::Confirmed);
        assert(ship_order(id) == true);
        assert(get_order_state(id) == OrderState::Shipped);
        assert(deliver_order(id) == true);
        assert(get_order_state(id) == OrderState::Delivered);
        cout << "PASS test_full_lifecycle" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_full_lifecycle" << endl;
        failed++;
    }

    // Test 3: invalid transition — skip from Created to Shipped
    try {
        reset_manager();
        auto id = create_order({{"PROD-1", 1}}, 100.0);
        assert(ship_order(id) == false);
        assert(get_order_state(id) == OrderState::Created); // unchanged
        cout << "PASS test_invalid_skip_to_shipped" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_invalid_skip_to_shipped" << endl;
        failed++;
    }

    // Test 4: invalid transition — skip from Created to Delivered
    try {
        reset_manager();
        auto id = create_order({{"PROD-1", 1}}, 100.0);
        assert(deliver_order(id) == false);
        assert(get_order_state(id) == OrderState::Created);
        cout << "PASS test_invalid_skip_to_delivered" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_invalid_skip_to_delivered" << endl;
        failed++;
    }

    // Test 5: invalid transition — backward from Shipped to Created
    try {
        reset_manager();
        auto id = create_order({{"PROD-1", 1}}, 100.0);
        confirm_order(id);
        ship_order(id);
        assert(confirm_order(id) == false); // can't go back
        assert(get_order_state(id) == OrderState::Shipped);
        cout << "PASS test_invalid_backward_transition" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_invalid_backward_transition" << endl;
        failed++;
    }

    // Test 6: multiple orders are independent
    try {
        reset_manager();
        auto id1 = create_order({{"PROD-1", 1}}, 100.0);
        auto id2 = create_order({{"PROD-2", 1}}, 200.0);
        confirm_order(id1);
        assert(get_order_state(id1) == OrderState::Confirmed);
        assert(get_order_state(id2) == OrderState::Created);
        cout << "PASS test_multiple_orders_independent" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_multiple_orders_independent" << endl;
        failed++;
    }

    // Test 7: confirm non-existent order returns false
    try {
        reset_manager();
        assert(confirm_order("NONEXISTENT") == false);
        cout << "PASS test_nonexistent_order" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_nonexistent_order" << endl;
        failed++;
    }

    cout << "PART1_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
