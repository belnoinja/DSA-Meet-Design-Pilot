// Part 3 Tests — Discount Eligibility Rules
// Tests minimum cart value, first-time user, and category-specific rules

#include <cassert>
#include <iostream>
#include <cmath>
using namespace std;

bool approx3(double a, double b, double eps = 0.01) {
    return fabs(a - b) < eps;
}

int part3_tests() {
    int passed = 0;
    int failed = 0;

    // Test 1: minimum cart value met — discount applies
    try {
        vector<CartItem> cart = {
            {"Laptop", 50000.0, 1, "electronics"},
        };
        PercentageDiscount pct(10.0);
        UserContext user{false};
        double result = apply_with_eligibility(cart, &pct, 1000.0, false, user, "");
        // Total 50000 >= 1000, discount applies: 45000
        assert(approx3(result, 45000.0));
        cout << "PASS test_min_cart_value_met" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_min_cart_value_met" << endl;
        failed++;
    }

    // Test 2: minimum cart value NOT met — discount skipped
    try {
        vector<CartItem> cart = {
            {"Sticker", 50.0, 1, "accessories"},
        };
        PercentageDiscount pct(10.0);
        UserContext user{false};
        double result = apply_with_eligibility(cart, &pct, 1000.0, false, user, "");
        // Total 50 < 1000, discount skipped: 50
        assert(approx3(result, 50.0));
        cout << "PASS test_min_cart_value_not_met" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_min_cart_value_not_met" << endl;
        failed++;
    }

    // Test 3: first-time user required and user IS first-time
    try {
        vector<CartItem> cart = {
            {"Phone", 20000.0, 1, "electronics"},
        };
        FlatDiscount flat(2000.0);
        UserContext user{true};
        double result = apply_with_eligibility(cart, &flat, 0.0, true, user, "");
        // First-time user, discount applies: 20000 - 2000 = 18000
        assert(approx3(result, 18000.0));
        cout << "PASS test_first_time_user_eligible" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_first_time_user_eligible" << endl;
        failed++;
    }

    // Test 4: first-time user required but user is NOT first-time
    try {
        vector<CartItem> cart = {
            {"Phone", 20000.0, 1, "electronics"},
        };
        FlatDiscount flat(2000.0);
        UserContext user{false};
        double result = apply_with_eligibility(cart, &flat, 0.0, true, user, "");
        // Not first-time, discount skipped: 20000
        assert(approx3(result, 20000.0));
        cout << "PASS test_first_time_user_not_eligible" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_first_time_user_not_eligible" << endl;
        failed++;
    }

    // Test 5: category-specific discount — only electronics discounted
    try {
        vector<CartItem> cart = {
            {"Laptop",     50000.0, 1, "electronics"},
            {"Phone Case",   500.0, 2, "accessories"},
        };
        PercentageDiscount pct(10.0);
        UserContext user{false};
        double result = apply_with_eligibility(cart, &pct, 0.0, false, user, "electronics");
        // Electronics: 50000 * 0.9 = 45000, Accessories: 1000 full price → 46000
        assert(approx3(result, 46000.0));
        cout << "PASS test_category_specific_discount" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_category_specific_discount" << endl;
        failed++;
    }

    // Test 6: all rules combined — min cart met, first-time, category filter
    try {
        vector<CartItem> cart = {
            {"Laptop",     50000.0, 1, "electronics"},
            {"T-Shirt",     1000.0, 3, "clothing"},
        };
        PercentageDiscount pct(20.0);
        UserContext user{true};
        double result = apply_with_eligibility(cart, &pct, 5000.0, true, user, "electronics");
        // Total = 53000 >= 5000, first-time user OK
        // Electronics: 50000 * 0.8 = 40000, Clothing: 3000 full price → 43000
        assert(approx3(result, 43000.0));
        cout << "PASS test_all_rules_combined" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_all_rules_combined" << endl;
        failed++;
    }

    cout << "PART3_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
