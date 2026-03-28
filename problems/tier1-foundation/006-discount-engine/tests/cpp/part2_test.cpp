// Part 2 Tests — Stacked Discounts (Decorator)
// Tests discount chaining with multiple discount types

#include <cassert>
#include <iostream>
#include <cmath>
using namespace std;

// Note: solution.cpp is included via the harness (not directly here)
// These tests assume apply_stacked_discounts() is available

bool approx2(double a, double b, double eps = 0.01) {
    return fabs(a - b) < eps;
}

int part2_tests() {
    int passed = 0;
    int failed = 0;

    // Test 1: stack percentage then flat
    try {
        vector<CartItem> cart = {
            {"Laptop", 10000.0, 1, "electronics"},
        };
        // Total = 10000 → 10% off → 9000 → Rs.500 flat off → 8500
        PercentageDiscount pct(10.0);
        FlatDiscount flat(500.0);
        double result = apply_stacked_discounts(cart, {&pct, &flat});
        assert(approx2(result, 8500.0));
        cout << "PASS test_stack_percentage_then_flat" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_stack_percentage_then_flat" << endl;
        failed++;
    }

    // Test 2: stack flat then percentage
    try {
        vector<CartItem> cart = {
            {"Laptop", 10000.0, 1, "electronics"},
        };
        // Total = 10000 → Rs.500 flat off → 9500 → 10% off → 8550
        FlatDiscount flat(500.0);
        PercentageDiscount pct(10.0);
        double result = apply_stacked_discounts(cart, {&flat, &pct});
        assert(approx2(result, 8550.0));
        cout << "PASS test_stack_flat_then_percentage" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_stack_flat_then_percentage" << endl;
        failed++;
    }

    // Test 3: stack three discounts
    try {
        vector<CartItem> cart = {
            {"Phone", 20000.0, 1, "electronics"},
        };
        // Total = 20000 → 10% coupon → 18000 → Rs.1000 seasonal → 17000 → 5% membership → 16150
        PercentageDiscount coupon(10.0);
        FlatDiscount seasonal(1000.0);
        PercentageDiscount membership(5.0);
        double result = apply_stacked_discounts(cart, {&coupon, &seasonal, &membership});
        assert(approx2(result, 16150.0));
        cout << "PASS test_stack_three_discounts" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_stack_three_discounts" << endl;
        failed++;
    }

    // Test 4: single discount in stack behaves like direct application
    try {
        vector<CartItem> cart = {
            {"Book", 500.0, 2, "books"},
        };
        PercentageDiscount pct(20.0);
        double stacked = apply_stacked_discounts(cart, {&pct});
        double direct = apply_percentage_discount(cart, 20.0);
        assert(approx2(stacked, direct));
        cout << "PASS test_single_discount_stack" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_single_discount_stack" << endl;
        failed++;
    }

    // Test 5: stacked discounts that reduce to zero
    try {
        vector<CartItem> cart = {
            {"Sticker", 100.0, 1, "accessories"},
        };
        FlatDiscount flat1(60.0);
        FlatDiscount flat2(60.0);
        double result = apply_stacked_discounts(cart, {&flat1, &flat2});
        assert(approx2(result, 0.0));
        cout << "PASS test_stack_reduces_to_zero" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_stack_reduces_to_zero" << endl;
        failed++;
    }

    cout << "PART2_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
