// Part 2 Tests — Cancellation + Inventory Release
// Tests cancellation rules and inventory management

#include <cassert>
#include <iostream>
using namespace std;

int part2_tests() {
    int passed = 0;
    int failed = 0;

    // Test 1: cancel from Created state succeeds
    try {
        reset_manager();
        set_inventory("PROD-1", 10);
        auto id = create_order({{"PROD-1", 3}}, 300.0);
        assert(get_inventory("PROD-1") == 7); // decremented on create
        assert(cancel_order(id) == true);
        assert(get_order_state(id) == OrderState::Cancelled);
        assert(get_inventory("PROD-1") == 10); // restored on cancel
        cout << "PASS test_cancel_from_created" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_cancel_from_created" << endl;
        failed++;
    }

    // Test 2: cancel from Confirmed state succeeds
    try {
        reset_manager();
        set_inventory("PROD-1", 10);
        auto id = create_order({{"PROD-1", 2}}, 200.0);
        confirm_order(id);
        assert(cancel_order(id) == true);
        assert(get_order_state(id) == OrderState::Cancelled);
        assert(get_inventory("PROD-1") == 10);
        cout << "PASS test_cancel_from_confirmed" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_cancel_from_confirmed" << endl;
        failed++;
    }

    // Test 3: cancel from Shipped state fails
    try {
        reset_manager();
        set_inventory("PROD-1", 10);
        auto id = create_order({{"PROD-1", 2}}, 200.0);
        confirm_order(id);
        ship_order(id);
        assert(cancel_order(id) == false);
        assert(get_order_state(id) == OrderState::Shipped);
        assert(get_inventory("PROD-1") == 8); // not restored
        cout << "PASS test_cancel_from_shipped_fails" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_cancel_from_shipped_fails" << endl;
        failed++;
    }

    // Test 4: cancel from Delivered state fails
    try {
        reset_manager();
        set_inventory("PROD-1", 10);
        auto id = create_order({{"PROD-1", 1}}, 100.0);
        confirm_order(id);
        ship_order(id);
        deliver_order(id);
        assert(cancel_order(id) == false);
        assert(get_order_state(id) == OrderState::Delivered);
        cout << "PASS test_cancel_from_delivered_fails" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_cancel_from_delivered_fails" << endl;
        failed++;
    }

    // Test 5: cancel restores inventory for multiple items
    try {
        reset_manager();
        set_inventory("PROD-A", 20);
        set_inventory("PROD-B", 15);
        auto id = create_order({{"PROD-A", 5}, {"PROD-B", 3}}, 800.0);
        assert(get_inventory("PROD-A") == 15);
        assert(get_inventory("PROD-B") == 12);
        cancel_order(id);
        assert(get_inventory("PROD-A") == 20);
        assert(get_inventory("PROD-B") == 15);
        cout << "PASS test_cancel_multi_item_inventory" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_cancel_multi_item_inventory" << endl;
        failed++;
    }

    // Test 6: cannot cancel an already cancelled order
    try {
        reset_manager();
        set_inventory("PROD-1", 10);
        auto id = create_order({{"PROD-1", 2}}, 200.0);
        cancel_order(id);
        assert(cancel_order(id) == false); // already cancelled
        cout << "PASS test_double_cancel_fails" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_double_cancel_fails" << endl;
        failed++;
    }

    cout << "PART2_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
