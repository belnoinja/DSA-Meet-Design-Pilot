// Part 3 Tests — User Tier-Based Rate Limits
// Tests that different user tiers get different rate limits

#include <cassert>
#include <iostream>
using namespace std;

int part3_tests() {
    int passed = 0;
    int failed = 0;

    // Test 1: FREE tier allows only 10 requests per minute
    try {
        // Send 10 requests — all should pass
        for (int i = 0; i < 10; i++) {
            assert(allow_request_for_tier(UserTier::FREE,
                {"free_user", 5000 + i, "/api/data"}) == true);
        }
        // 11th should be rejected
        assert(allow_request_for_tier(UserTier::FREE,
            {"free_user", 5010, "/api/data"}) == false);
        cout << "PASS test_free_tier_limit" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_free_tier_limit" << endl;
        failed++;
    }

    // Test 2: PRO tier allows 100 requests per minute
    try {
        for (int i = 0; i < 100; i++) {
            assert(allow_request_for_tier(UserTier::PRO,
                {"pro_user", 6000 + i, "/api/data"}) == true);
        }
        // 101st should be rejected
        assert(allow_request_for_tier(UserTier::PRO,
            {"pro_user", 6100, "/api/data"}) == false);
        cout << "PASS test_pro_tier_limit" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_pro_tier_limit" << endl;
        failed++;
    }

    // Test 3: ENTERPRISE tier allows 1000 requests per minute
    try {
        for (int i = 0; i < 1000; i++) {
            assert(allow_request_for_tier(UserTier::ENTERPRISE,
                {"enterprise_user", 7000 + i, "/api/data"}) == true);
        }
        // 1001st should be rejected
        assert(allow_request_for_tier(UserTier::ENTERPRISE,
            {"enterprise_user", 8000, "/api/data"}) == false);
        cout << "PASS test_enterprise_tier_limit" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_enterprise_tier_limit" << endl;
        failed++;
    }

    // Test 4: different tiers are independent (different users)
    try {
        // Free user hits limit at 10
        for (int i = 0; i < 10; i++) {
            allow_request_for_tier(UserTier::FREE,
                {"free_user_2", 9000 + i, "/api/x"});
        }
        assert(allow_request_for_tier(UserTier::FREE,
            {"free_user_2", 9010, "/api/x"}) == false);

        // Pro user still has quota
        assert(allow_request_for_tier(UserTier::PRO,
            {"pro_user_2", 9010, "/api/x"}) == true);
        cout << "PASS test_tier_independence" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_tier_independence" << endl;
        failed++;
    }

    cout << "PART3_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
