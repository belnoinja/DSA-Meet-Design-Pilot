// Part 1 Tests — Room Booking with Conflict Detection
// Tests booking, availability checking, and schedule retrieval

#include "solution.cpp"
#include <cassert>
#include <iostream>
using namespace std;

int part1_tests() {
    int passed = 0;
    int failed = 0;

    // Test 1: book a meeting successfully
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Small Room", 4, false});
        Meeting m{"M1", "Standup", 540, 570, "R1"};
        assert(s.bookMeeting(m) == true);
        cout << "PASS test_book_meeting" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_book_meeting" << endl;
        failed++;
    }

    // Test 2: conflict detection — overlapping meetings on same room
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Small Room", 4, false});
        s.bookMeeting({"M1", "Standup", 540, 570, "R1"});
        // Overlapping: starts at 550, before M1 ends at 570
        assert(s.bookMeeting({"M2", "Planning", 550, 600, "R1"}) == false);
        cout << "PASS test_conflict_detection" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_conflict_detection" << endl;
        failed++;
    }

    // Test 3: adjacent meetings do NOT conflict
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Small Room", 4, false});
        s.bookMeeting({"M1", "Standup", 540, 570, "R1"});
        // Starts exactly when M1 ends — no overlap
        assert(s.bookMeeting({"M2", "Planning", 570, 630, "R1"}) == true);
        cout << "PASS test_adjacent_no_conflict" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_adjacent_no_conflict" << endl;
        failed++;
    }

    // Test 4: different rooms don't conflict
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Small Room", 4, false});
        s.addRoom({"R2", "Large Room", 20, true});
        s.bookMeeting({"M1", "Standup", 540, 570, "R1"});
        // Same time, different room — should succeed
        assert(s.bookMeeting({"M2", "Planning", 540, 570, "R2"}) == true);
        cout << "PASS test_different_rooms_no_conflict" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_different_rooms_no_conflict" << endl;
        failed++;
    }

    // Test 5: is_available returns true for free slot
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Small Room", 4, false});
        assert(s.isAvailable("R1", 540, 570) == true);
        cout << "PASS test_is_available_free" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_is_available_free" << endl;
        failed++;
    }

    // Test 6: is_available returns false for occupied slot
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Small Room", 4, false});
        s.bookMeeting({"M1", "Standup", 540, 570, "R1"});
        assert(s.isAvailable("R1", 550, 580) == false);
        cout << "PASS test_is_available_occupied" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_is_available_occupied" << endl;
        failed++;
    }

    // Test 7: get_room_schedule returns meetings sorted by start time
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Small Room", 4, false});
        s.bookMeeting({"M2", "Planning", 600, 660, "R1"});
        s.bookMeeting({"M1", "Standup", 540, 570, "R1"});
        auto sched = s.getRoomSchedule("R1");
        assert(sched.size() == 2);
        assert(sched[0].id == "M1");  // earlier meeting first
        assert(sched[1].id == "M2");
        cout << "PASS test_schedule_sorted" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_schedule_sorted" << endl;
        failed++;
    }

    // Test 8: booking to nonexistent room fails
    try {
        MeetingScheduler s;
        assert(s.bookMeeting({"M1", "Standup", 540, 570, "R99"}) == false);
        cout << "PASS test_nonexistent_room" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_nonexistent_room" << endl;
        failed++;
    }

    // Test 9: empty schedule
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Small Room", 4, false});
        auto sched = s.getRoomSchedule("R1");
        assert(sched.empty());
        cout << "PASS test_empty_schedule" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_empty_schedule" << endl;
        failed++;
    }

    cout << "PART1_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
