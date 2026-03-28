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

// ─── Scheduler ──────────────────────────────────────────────────────────────
// HINT: Use an unordered_map to map roomId -> vector<Meeting>.
// Two intervals [s1,e1) and [s2,e2) overlap if s1 < e2 && s2 < e1.

// class MeetingScheduler {
// private:
//     unordered_map<string, Room> rooms;
//     unordered_map<string, vector<Meeting>> schedule;
// public:
//     void addRoom(const Room& room);
//     bool isAvailable(const string& roomId, int start, int end);
//     bool bookMeeting(const Meeting& meeting);
//     vector<Meeting> getRoomSchedule(const string& roomId);
// };

// ─── Test Entry Points (must exist for tests to compile) ────────────────────
// Your solution must provide these functions:
//
//   bool book_meeting(const Meeting& meeting);
//   vector<Meeting> get_room_schedule(const string& roomId);
//   bool is_available(const string& roomId, int startTime, int endTime);
//
// How you implement them internally is up to you.
// ─────────────────────────────────────────────────────────────────────────────


