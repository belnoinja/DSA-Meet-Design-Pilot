// Part 3 Tests — Attendee Notifications (Observer Pattern)
// Tests that observers are notified on book, cancel, and reschedule

#include <cassert>
#include <iostream>
using namespace std;

// ─── Test Observer ──────────────────────────────────────────────────────────

class TestObserver : public MeetingObserver {
public:
    int bookedCount = 0;
    int cancelledCount = 0;
    int rescheduledCount = 0;
    string lastBookedMeetingId;
    string lastCancelledMeetingId;
    string lastRescheduledMeetingId;
    int lastNewStart = 0;
    int lastNewEnd = 0;

    void onMeetingBooked(const Meeting& meeting) override {
        bookedCount++;
        lastBookedMeetingId = meeting.id;
    }

    void onMeetingCancelled(const Meeting& meeting) override {
        cancelledCount++;
        lastCancelledMeetingId = meeting.id;
    }

    void onMeetingRescheduled(const Meeting& oldMeeting,
                              const Meeting& newMeeting) override {
        rescheduledCount++;
        lastRescheduledMeetingId = newMeeting.id;
        lastNewStart = newMeeting.startTime;
        lastNewEnd = newMeeting.endTime;
    }
};

int part3_tests() {
    int passed = 0;
    int failed = 0;

    // Test 1: observer notified on booking
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Small", 4, false});
        TestObserver obs;
        s.subscribeAttendee("M1", &obs);
        s.bookMeeting({"M1", "Standup", 540, 570, "R1"});
        assert(obs.bookedCount == 1);
        assert(obs.lastBookedMeetingId == "M1");
        cout << "PASS test_observer_on_book" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_observer_on_book" << endl;
        failed++;
    }

    // Test 2: observer notified on cancellation
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Small", 4, false});
        TestObserver obs;
        s.subscribeAttendee("M1", &obs);
        s.bookMeeting({"M1", "Standup", 540, 570, "R1"});
        s.cancelMeeting("M1");
        assert(obs.cancelledCount == 1);
        assert(obs.lastCancelledMeetingId == "M1");
        // Room should be free again
        assert(s.isAvailable("R1", 540, 570) == true);
        cout << "PASS test_observer_on_cancel" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_observer_on_cancel" << endl;
        failed++;
    }

    // Test 3: observer notified on reschedule
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Small", 4, false});
        TestObserver obs;
        s.subscribeAttendee("M1", &obs);
        s.bookMeeting({"M1", "Standup", 540, 570, "R1"});
        bool ok = s.rescheduleMeeting("M1", 600, 630);
        assert(ok == true);
        assert(obs.rescheduledCount == 1);
        assert(obs.lastNewStart == 600);
        assert(obs.lastNewEnd == 630);
        // Old slot should be free
        assert(s.isAvailable("R1", 540, 570) == true);
        // New slot should be occupied
        assert(s.isAvailable("R1", 600, 630) == false);
        cout << "PASS test_observer_on_reschedule" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_observer_on_reschedule" << endl;
        failed++;
    }

    // Test 4: reschedule fails if new time conflicts
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Small", 4, false});
        s.bookMeeting({"M1", "Standup", 540, 570, "R1"});
        s.bookMeeting({"M2", "Planning", 600, 660, "R1"});
        bool ok = s.rescheduleMeeting("M1", 610, 650);
        assert(ok == false);  // conflicts with M2
        // M1 should still be in original slot
        assert(s.isAvailable("R1", 540, 570) == false);
        cout << "PASS test_reschedule_conflict" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_reschedule_conflict" << endl;
        failed++;
    }

    // Test 5: multiple observers on same meeting
    try {
        MeetingScheduler s;
        s.addRoom({"R1", "Small", 4, false});
        TestObserver obs1, obs2;
        s.subscribeAttendee("M1", &obs1);
        s.subscribeAttendee("M1", &obs2);
        s.bookMeeting({"M1", "Standup", 540, 570, "R1"});
        assert(obs1.bookedCount == 1);
        assert(obs2.bookedCount == 1);
        cout << "PASS test_multiple_observers" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_multiple_observers" << endl;
        failed++;
    }

    // Test 6: cancel nonexistent meeting returns false
    try {
        MeetingScheduler s;
        assert(s.cancelMeeting("M99") == false);
        cout << "PASS test_cancel_nonexistent" << endl;
        passed++;
    } catch (...) {
        cout << "FAIL test_cancel_nonexistent" << endl;
        failed++;
    }

    cout << "PART3_SUMMARY " << passed << "/" << (passed + failed) << endl;
    return failed;
}
