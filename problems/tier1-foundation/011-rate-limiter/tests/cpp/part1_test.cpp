// Part 1 Tests — Fixed-Window Rate Limiter
// Tests basic fixed-window rate limiting with per-client tracking

#include "solution.cpp"
#include <cassert>
#include <iostream>
using namespace std;

int part1_tests() {
    int passed = 0;
    int failed = 0;

    // Test 1: allow requests within limit
    try {
        init_limiter(3, 60); // 3 requests per 60 seconds
        Request r1{"client_A", 1000, "/api/search"};
        Request r2{"client_A", 1001, "/api/search"};
        Request r3{"client_A", 1002, "/api/search"};
        assert(allow_request(r1) == true);
        assert(allow_request(r2) == true);
        assert(allow_request(r3) == true);
        cout << "PASS test_allow_within_limit" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_allow_within_limit" << endl;
        failed++;
    }

    // Test 2: reject requests exceeding limit
    try {
        init_limiter(3, 60);
        assert(allow_request({"client_B", 2000, "/api/pay"}) == true);
        assert(allow_request({"client_B", 2001, "/api/pay"}) == true);
        assert(allow_request({"client_B", 2002, "/api/pay"}) == true);
        assert(allow_request({"client_B", 2003, "/api/pay"}) == false); // 4th rejected
        assert(allow_request({"client_B", 2004, "/api/pay"}) == false); // 5th rejected
        cout << "PASS test_reject_over_limit" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_reject_over_limit" << endl;
        failed++;
    }

    // Test 3: different clients have independent limits
    try {
        init_limiter(2, 60);
        assert(allow_request({"alice", 3000, "/api/x"}) == true);
        assert(allow_request({"alice", 3001, "/api/x"}) == true);
        assert(allow_request({"alice", 3002, "/api/x"}) == false); // alice exhausted
        assert(allow_request({"bob",   3003, "/api/x"}) == true);  // bob still has quota
        assert(allow_request({"bob",   3004, "/api/x"}) == true);
        assert(allow_request({"bob",   3005, "/api/x"}) == false); // bob exhausted
        cout << "PASS test_independent_client_limits" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_independent_client_limits" << endl;
        failed++;
    }

    // Test 4: window reset allows new requests
    try {
        init_limiter(2, 60);
        assert(allow_request({"client_C", 1000, "/api/y"}) == true);
        assert(allow_request({"client_C", 1020, "/api/y"}) == true);
        assert(allow_request({"client_C", 1040, "/api/y"}) == false); // limit hit in window [960, 1020)
        // New window starts at 1060
        assert(allow_request({"client_C", 1060, "/api/y"}) == true);  // new window
        assert(allow_request({"client_C", 1080, "/api/y"}) == true);
        cout << "PASS test_window_reset" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_window_reset" << endl;
        failed++;
    }

    // Test 5: get_request_count tracks correctly
    try {
        init_limiter(5, 60);
        assert(get_request_count("new_client") == 0);
        allow_request({"new_client", 5000, "/api/z"});
        assert(get_request_count("new_client") == 1);
        allow_request({"new_client", 5001, "/api/z"});
        assert(get_request_count("new_client") == 2);
        cout << "PASS test_get_request_count" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_get_request_count" << endl;
        failed++;
    }

    cout << "PART1_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
