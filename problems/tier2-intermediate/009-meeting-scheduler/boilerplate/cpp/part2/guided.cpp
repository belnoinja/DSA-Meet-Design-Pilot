#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <climits>
using namespace std;

// ─── Data Model (given — do not modify) ─────────────────────────────────────

struct Room {
    string id;
    string name;
    int capacity;
    bool hasAV;
};

struct Meeting {
    string id;
    string title;
    int startTime;
    int endTime;
    string roomId;
};

// ─── Forward declaration ────────────────────────────────────────────────────

class MeetingScheduler;

// ─── Strategy Interface ─────────────────────────────────────────────────────
// HINT: Each strategy picks a room from a list of available rooms.
// The strategy needs to know: available rooms, time slot, attendee count.

class AllocationStrategy {
public:
    virtual string selectRoom(const vector<Room>& rooms,
                              const MeetingScheduler& scheduler,
                              int startTime, int endTime,
                              int attendeeCount) = 0;
    virtual ~AllocationStrategy() = default;
};

// ─── Scheduler (extend your Part 1 solution) ────────────────────────────────
// HINT: Add a setStrategy() method and a bookWithStrategy() that delegates
// room selection to the current strategy.

// class MeetingScheduler {
//     ...your Part 1 fields...
//     AllocationStrategy* strategy;
// public:
//     void setStrategy(AllocationStrategy* s);
//     string bookWithStrategy(const string& meetingId, const string& title,
//                             int startTime, int endTime, int attendeeCount);
// };

// ─── Concrete Strategies ────────────────────────────────────────────────────
// TODO: Implement each strategy:
//   - FirstAvailable: pick first room (by ID order) that fits and is available
//   - BestFit: pick smallest room (by capacity) that fits and is available
//   - PriorityBased: prefer AV rooms; among those, pick smallest that fits

// ─── Test Entry Points (must exist for tests to compile) ────────────────────
//   bool book_meeting(const Meeting& meeting);
//   vector<Meeting> get_room_schedule(const string& roomId);
//   bool is_available(const string& roomId, int startTime, int endTime);
//   string book_with_strategy(const string& meetingId, const string& title,
//       int startTime, int endTime, int attendeeCount);
// ─────────────────────────────────────────────────────────────────────────────


