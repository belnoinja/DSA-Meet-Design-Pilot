// Part 2 Tests — Multiple Allocation Strategies
// Tests first-available, best-fit, and priority-based room allocation

#include <cassert>
#include <iostream>
using namespace std;

int part2_tests() {
    int passed = 0;
    int failed = 0;

    // Test 1: FirstAvailable picks first room by ID order
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Small", 4, false});
        s.addRoom({"R2", "Medium", 10, false});
        s.addRoom({"R3", "Large", 20, true});
        FirstAvailable fa;
        s.setStrategy(&fa);
        string roomId = s.bookWithStrategy("M1", "Standup", 540, 570, 3);
        assert(roomId == "R1");  // first room that fits 3 people
        cout << "PASS test_first_available" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_first_available" << endl;
        failed++;
    }

    // Test 2: FirstAvailable skips occupied rooms
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Small", 4, false});
        s.addRoom({"R2", "Medium", 10, false});
        FirstAvailable fa;
        s.setStrategy(&fa);
        s.bookMeeting({"M1", "Standup", 540, 570, "R1"});
        string roomId = s.bookWithStrategy("M2", "Planning", 540, 570, 3);
        assert(roomId == "R2");  // R1 is occupied, falls to R2
        cout << "PASS test_first_available_skip_occupied" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_first_available_skip_occupied" << endl;
        failed++;
    }

    // Test 3: BestFit picks smallest room that fits
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Tiny", 2, false});
        s.addRoom({"R2", "Small", 6, false});
        s.addRoom({"R3", "Large", 20, true});
        BestFit bf;
        s.setStrategy(&bf);
        string roomId = s.bookWithStrategy("M1", "Meeting", 540, 570, 5);
        assert(roomId == "R2");  // R1 too small (2 < 5), R2 fits (6 >= 5), R3 too big
        cout << "PASS test_best_fit" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_best_fit" << endl;
        failed++;
    }

    // Test 4: BestFit returns empty when no room fits
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Tiny", 2, false});
        s.addRoom({"R2", "Small", 4, false});
        BestFit bf;
        s.setStrategy(&bf);
        string roomId = s.bookWithStrategy("M1", "Big Meeting", 540, 570, 10);
        assert(roomId == "");  // no room fits 10 people
        cout << "PASS test_best_fit_no_room" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_best_fit_no_room" << endl;
        failed++;
    }

    // Test 5: PriorityBased prefers AV rooms
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Small", 6, false});
        s.addRoom({"R2", "Medium AV", 10, true});
        s.addRoom({"R3", "Large AV", 20, true});
        PriorityBased pb;
        s.setStrategy(&pb);
        string roomId = s.bookWithStrategy("M1", "Presentation", 540, 570, 5);
        assert(roomId == "R2");  // smallest AV room that fits
        cout << "PASS test_priority_prefers_av" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_priority_prefers_av" << endl;
        failed++;
    }

    // Test 6: PriorityBased falls back to non-AV when no AV available
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Small", 6, false});
        s.addRoom({"R2", "Medium AV", 10, true});
        PriorityBased pb;
        s.setStrategy(&pb);
        // Occupy the AV room
        s.bookMeeting({"M0", "Existing", 540, 570, "R2"});
        string roomId = s.bookWithStrategy("M1", "Meeting", 540, 570, 5);
        assert(roomId == "R1");  // AV room occupied, fall back to non-AV
        cout << "PASS test_priority_fallback_non_av" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_priority_fallback_non_av" << endl;
        failed++;
    }

    cout << "PART2_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
