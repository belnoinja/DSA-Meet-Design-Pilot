// Part 2 Tests — Multiple Rate-Limiting Algorithms
// Tests Strategy + Factory for fixed-window, sliding-window, token-bucket

#include <cassert>
#include <iostream>
using namespace std;

// Note: solution.cpp is included via the harness (not directly here)
// These tests assume create_limiter() and allow_request_with_strategy() are available

int part2_tests() {
    int passed = 0;
    int failed = 0;

    // Test 1: Factory creates fixed-window limiter
    try {
        RateLimiter* limiter = create_limiter("fixed-window", 3, 60);
        assert(limiter != nullptr);
        assert(limiter->allowRequest({"user_1", 1000, "/api/a"}) == true);
        assert(limiter->allowRequest({"user_1", 1001, "/api/a"}) == true);
        assert(limiter->allowRequest({"user_1", 1002, "/api/a"}) == true);
        assert(limiter->allowRequest({"user_1", 1003, "/api/a"}) == false);
        delete limiter;
        cout << "PASS test_factory_fixed_window" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_factory_fixed_window" << endl;
        failed++;
    }

    // Test 2: Sliding-window counts in rolling window
    try {
        RateLimiter* limiter = create_limiter("sliding-window", 3, 60);
        assert(limiter != nullptr);
        assert(limiter->allowRequest({"user_2", 1000, "/api/b"}) == true);
        assert(limiter->allowRequest({"user_2", 1030, "/api/b"}) == true);
        assert(limiter->allowRequest({"user_2", 1050, "/api/b"}) == true);
        assert(limiter->allowRequest({"user_2", 1055, "/api/b"}) == false); // 4th in 60s window
        // After first request expires from window
        assert(limiter->allowRequest({"user_2", 1061, "/api/b"}) == true); // 1000 is now outside [1001,1061]
        delete limiter;
        cout << "PASS test_sliding_window" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_sliding_window" << endl;
        failed++;
    }

    // Test 3: Token-bucket allows bursts then throttles
    try {
        RateLimiter* limiter = create_limiter("token-bucket", 3, 60);
        assert(limiter != nullptr);
        // Burst: use all 3 tokens immediately
        assert(limiter->allowRequest({"user_3", 1000, "/api/c"}) == true);
        assert(limiter->allowRequest({"user_3", 1000, "/api/c"}) == true);
        assert(limiter->allowRequest({"user_3", 1000, "/api/c"}) == true);
        assert(limiter->allowRequest({"user_3", 1000, "/api/c"}) == false); // empty
        // Wait for tokens to refill (rate = 3/60 = 0.05/sec, need 20sec for 1 token)
        assert(limiter->allowRequest({"user_3", 1020, "/api/c"}) == true); // 1 token refilled
        assert(limiter->allowRequest({"user_3", 1020, "/api/c"}) == false); // empty again
        delete limiter;
        cout << "PASS test_token_bucket" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_token_bucket" << endl;
        failed++;
    }

    // Test 4: Factory returns nullptr for unknown algorithm
    try {
        RateLimiter* limiter = create_limiter("unknown-algo", 10, 60);
        assert(limiter == nullptr);
        cout << "PASS test_factory_unknown_algorithm" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_factory_unknown_algorithm" << endl;
        failed++;
    }

    // Test 5: allow_request_with_strategy uses correct algorithm
    try {
        // Reset state for strategy-based requests
        assert(allow_request_with_strategy("fixed-window", {"user_4", 2000, "/api/d"}) == true);
        assert(allow_request_with_strategy("fixed-window", {"user_4", 2001, "/api/d"}) == true);
        cout << "PASS test_allow_request_with_strategy" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_allow_request_with_strategy" << endl;
        failed++;
    }

    cout << "PART2_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
