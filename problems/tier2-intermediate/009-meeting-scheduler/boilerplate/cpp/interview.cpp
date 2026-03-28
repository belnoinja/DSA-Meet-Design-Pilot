#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
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
    int startTime;  // minutes since midnight
    int endTime;
    string roomId;
};

// ─── Your Design Starts Here ────────────────────────────────────────────────
//
// Design and implement a MeetingScheduler that:
//   1. Manages rooms and their meeting schedules
//   2. Detects conflicts when booking (two meetings cannot overlap on the
//      same room)
//   3. Returns a room's schedule sorted by start time
//
// Think about:
//   - How do you check if two time intervals overlap?
//   - What data structure maps roomId -> meetings efficiently?
//   - How will this extend to support automatic room allocation later?
//
// Entry points (must exist for tests):
//   bool book_meeting(const Meeting& meeting);
//   vector<Meeting> get_room_schedule(const string& roomId);
//   bool is_available(const string& roomId, int startTime, int endTime);
//
// ─────────────────────────────────────────────────────────────────────────────


