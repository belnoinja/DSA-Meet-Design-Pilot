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

// ─── NEW in Extension 1 ────────────────────────────────────────────────────
//
// The office manager wants AUTOMATIC room allocation using different
// strategies: first-available, best-fit, and priority-based (prefer AV rooms).
//
// Think about:
//   - How do you swap allocation algorithms without modifying the scheduler?
//   - What interface lets all strategies work interchangeably?
//   - How does the Strategy pattern apply here?
//
// Entry points (must exist for tests):
//   bool book_meeting(const Meeting& meeting);
//   vector<Meeting> get_room_schedule(const string& roomId);
//   bool is_available(const string& roomId, int startTime, int endTime);
//   string book_with_strategy(const string& meetingId, const string& title,
//       int startTime, int endTime, int attendeeCount);
//
// ─────────────────────────────────────────────────────────────────────────────


