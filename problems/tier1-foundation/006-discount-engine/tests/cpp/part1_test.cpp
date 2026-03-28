// Part 1 Tests — Billing & Discount Engine
// Tests the three basic discount strategies: percentage, flat, buy-X-get-Y

#include "solution.cpp"
#include <cassert>
#include <iostream>
#include <cmath>
using namespace std;

bool approx(double a, double b, double eps = 0.01) {
    return fabs(a - b) < eps;
}

int part1_tests() {
    int passed = 0;
    int failed = 0;

    // Test 1: percentage discount — 10% off
    try {
        vector<CartItem> cart = {
            {"Laptop",     50000.0, 1, "electronics"},
            {"Phone Case",   500.0, 2, "accessories"},
        };
        // Total = 50000 + 1000 = 51000, 10% off = 45900
        double result = apply_percentage_discount(cart, 10.0);
        assert(approx(result, 45900.0));
        cout << "PASS test_percentage_discount" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_percentage_discount" << endl;
        failed++;
    }

    // Test 2: flat discount — Rs. 200 off
    try {
        vector<CartItem> cart = {
            {"Headphones", 2000.0, 1, "electronics"},
            {"Cable",       300.0, 3, "accessories"},
        };
        // Total = 2000 + 900 = 2900, flat 200 off = 2700
        double result = apply_flat_discount(cart, 200.0);
        assert(approx(result, 2700.0));
        cout << "PASS test_flat_discount" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_flat_discount" << endl;
        failed++;
    }

    // Test 3: flat discount exceeds total — should return 0
    try {
        vector<CartItem> cart = {
            {"Sticker", 50.0, 1, "accessories"},
        };
        double result = apply_flat_discount(cart, 200.0);
        assert(approx(result, 0.0));
        cout << "PASS test_flat_discount_exceeds_total" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_flat_discount_exceeds_total" << endl;
        failed++;
    }

    // Test 4: buy 2 get 1 free
    try {
        vector<CartItem> cart = {
            {"T-Shirt", 500.0, 6, "clothing"},  // 6 shirts: pay for 4
        };
        // 6 / (2+1) = 2 groups, each group pays for 2 → 4 paid items
        double result = apply_bogo(cart, 2, 1);
        assert(approx(result, 2000.0));
        cout << "PASS test_bogo_exact_groups" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_bogo_exact_groups" << endl;
        failed++;
    }

    // Test 5: buy 2 get 1 with remainder
    try {
        vector<CartItem> cart = {
            {"Socks", 200.0, 5, "clothing"},  // 5 socks: 1 group of 3 (pay 2) + 2 remainder (pay 2)
        };
        // 5 / 3 = 1 group (pay 2), remainder 2 (pay 2) → 4 paid items
        double result = apply_bogo(cart, 2, 1);
        assert(approx(result, 800.0));
        cout << "PASS test_bogo_with_remainder" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_bogo_with_remainder" << endl;
        failed++;
    }

    // Test 6: empty cart
    try {
        vector<CartItem> empty;
        assert(approx(apply_percentage_discount(empty, 10.0), 0.0));
        assert(approx(apply_flat_discount(empty, 100.0), 0.0));
        assert(approx(apply_bogo(empty, 2, 1), 0.0));
        cout << "PASS test_empty_cart" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_empty_cart" << endl;
        failed++;
    }

    // Test 7: single item, no discount effect (0%)
    try {
        vector<CartItem> cart = {{"Book", 300.0, 1, "books"}};
        double result = apply_percentage_discount(cart, 0.0);
        assert(approx(result, 300.0));
        cout << "PASS test_zero_percentage" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_zero_percentage" << endl;
        failed++;
    }

    cout << "PART1_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
